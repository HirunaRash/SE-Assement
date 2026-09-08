'use client';

/**
 * AI Report Writing Assistant
 * -------------------------------------------------------------------------
 * A chat interface where a team member describes their week in plain English
 * and the backend AI (POST /api/ai/analyze) extracts structured data:
 *   - tasks completed
 *   - achievements / highlights
 *   - blockers / challenges
 *   - tasks planned for next week
 *
 * The extracted data is rendered both as a conversational reply and as a
 * colour-coded summary section that can be copied into a weekly report.
 */

import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';
import PageHeader from '@/components/dashboard/PageHeader';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ChatRole = 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ExtractedData {
  tasks: string[];
  achievements: string[];
  blockers: string[];
  nextWeekTasks: string[];
}

/** Shape returned by `api.post` (it already unwraps the backend `{ data }`). */
type AnalyzeResponse = Partial<ExtractedData> | null | undefined;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Coerce an unknown value into a clean `string[]` (trims + drops empties). */
function toStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item : String(item ?? '')))
    .map((item) => item.trim())
    .filter(Boolean);
}

/** Normalise a raw API response into a fully-populated ExtractedData object. */
function normalizeExtractedData(raw: AnalyzeResponse): ExtractedData {
  return {
    tasks: toStringList(raw?.tasks),
    achievements: toStringList(raw?.achievements),
    blockers: toStringList(raw?.blockers),
    nextWeekTasks: toStringList(raw?.nextWeekTasks),
  };
}

/** True when the AI returned nothing usable across every category. */
function isEmptyExtractedData(data: ExtractedData): boolean {
  return (
    data.tasks.length === 0 &&
    data.achievements.length === 0 &&
    data.blockers.length === 0 &&
    data.nextWeekTasks.length === 0
  );
}

/** Build a friendly assistant reply summarising what was extracted. */
function buildAssistantSummary(data: ExtractedData): string {
  if (isEmptyExtractedData(data)) {
    return "I couldn't pull any clear tasks, achievements, blockers or plans from that. Try adding more detail about what you worked on this week.";
  }

  const lines: string[] = ["Here's what I extracted from your update:"];
  const section = (label: string, items: string[]) => {
    if (items.length === 0) return;
    lines.push('');
    lines.push(`${label}:`);
    items.forEach((item) => lines.push(`  • ${item}`));
  };

  section('Tasks completed', data.tasks);
  section('Achievements', data.achievements);
  section('Blockers', data.blockers);
  section('Next week', data.nextWeekTasks);

  return lines.join('\n');
}

/** Turn an unknown thrown value into a readable message. */
function toErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const message = (err as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  if (err instanceof Error && err.message) return err.message;
  return 'Something went wrong while contacting the AI assistant. Please try again.';
}

/* ------------------------------------------------------------------ */
/*  Presentational pieces                                              */
/* ------------------------------------------------------------------ */

/** A single colour-coded category inside the extracted-data panel. */
function ExtractedCategory({
  title,
  items,
  accent,
}: {
  title: string;
  items: string[];
  /** Tailwind text colour class for the header, e.g. `text-blue-300`. */
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-4">
      <h3 className={`mb-2 text-sm font-semibold uppercase tracking-wide ${accent}`}>
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-sm text-gray-200">
          {items.map((item, index) => (
            <li key={`${title}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm italic text-gray-500">None identified.</p>
      )}
    </div>
  );
}

/** Animated "AI is thinking" indicator. */
function LoadingIndicator() {
  return (
    <div className="flex items-center gap-3 text-sm text-green-300">
      <span className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-green-400 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-green-400 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-green-400" />
      </span>
      Analyzing your week…
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! Describe what you worked on this week in your own words — tasks, wins, anything blocking you, and what's next. I'll organise it into a report structure for you.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  // Keep the chat scrolled to the latest message / loading indicator.
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, loading]);

  /**
   * Core action: send the current input to the AI, append both the user
   * message and the AI reply to the conversation, and surface the
   * structured result. Guards against empty input and concurrent sends.
   */
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return; // 10) prevent empty messages / double-send

    // Optimistically add the user's message and reset the input.
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setInput(''); // 9) clear input after sending
    setError(null);
    setLoading(true);

    try {
      // `api.post` attaches the auth token and unwraps the backend `{ data }`.
      const response = (await api.post('/ai/analyze', {
        message: trimmed,
      })) as AnalyzeResponse;

      const data = normalizeExtractedData(response);
      setExtractedData(data);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: buildAssistantSummary(data) },
      ]);
    } catch (err) {
      const message = toErrorMessage(err);
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /** Enter sends, Shift+Enter inserts a newline. Ignored while loading. */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const canSend = input.trim().length > 0 && !loading;
  const hasExtractedData = extractedData !== null && !isEmptyExtractedData(extractedData);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="mx-auto max-w-3xl">
        <PageHeader
          eyebrow="AI Assistant"
          title="Report Writing Assistant"
          description="Describe your week in plain language and let the assistant extract your tasks, achievements, blockers, and plans for next week."
        />

        {/* ---------------------------------------------------------- */}
        {/*  Chat area                                                  */}
        {/* ---------------------------------------------------------- */}
        <section
          aria-label="Conversation"
          className="h-96 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 p-4"
        >
          <div className="flex flex-col gap-4">
            {messages.map((message, index) => {
              const isUser = message.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-lg border px-4 py-2 text-sm leading-relaxed shadow-sm transition-all duration-300 ${
                      isUser
                        ? 'border-blue-500/40 bg-blue-600/20 text-blue-100'
                        : 'border-green-500/30 bg-gray-900/70 text-green-200'
                    }`}
                  >
                    <span
                      className={`mb-1 block text-xs font-semibold uppercase tracking-wide ${
                        isUser ? 'text-blue-300' : 'text-green-400'
                      }`}
                    >
                      {isUser ? 'You' : 'Assistant'}
                    </span>
                    {message.content}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg border border-green-500/30 bg-gray-900/70 px-4 py-3">
                  <LoadingIndicator />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </section>

        {/* ---------------------------------------------------------- */}
        {/*  Inline error banner                                        */}
        {/* ---------------------------------------------------------- */}
        {error && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {/* ---------------------------------------------------------- */}
        {/*  Extracted data panel (only when we have something)         */}
        {/* ---------------------------------------------------------- */}
        {hasExtractedData && extractedData && (
          <section
            aria-label="Extracted report data"
            className="ai-assistant-fade-in mt-6 rounded-lg border border-gray-700 bg-gray-800 p-5"
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Extracted report data</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <ExtractedCategory
                title="Tasks completed"
                items={extractedData.tasks}
                accent="text-blue-300"
              />
              <ExtractedCategory
                title="Achievements"
                items={extractedData.achievements}
                accent="text-green-300"
              />
              <ExtractedCategory
                title="Blockers"
                items={extractedData.blockers}
                accent="text-red-300"
              />
              <ExtractedCategory
                title="Next week"
                items={extractedData.nextWeekTasks}
                accent="text-purple-300"
              />
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------- */}
        {/*  Input section                                              */}
        {/* ---------------------------------------------------------- */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={3}
            placeholder="e.g. This week I finished the login API and fixed two payment bugs. I'm blocked on the staging deploy. Next week I'll start the reporting dashboard."
            className="flex-1 resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-sm text-white placeholder-gray-500 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!canSend}
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:self-end"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Press <kbd className="rounded bg-gray-800 px-1">Enter</kbd> to send,{' '}
          <kbd className="rounded bg-gray-800 px-1">Shift</kbd>+
          <kbd className="rounded bg-gray-800 px-1">Enter</kbd> for a new line.
        </p>
      </div>
    </main>
  );
}
