import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function analyzeReportDescription(userMessage: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `You are a weekly report analysis assistant. The user describes what they did this week in natural language. 

Your job: Extract and categorize their work into:
1. Tasks completed (list of specific tasks)
2. Achievements (highlights/wins)
3. Blockers (obstacles/issues)
4. Next week tasks (what to do next)

User said: "${userMessage}"

Return ONLY valid JSON (no other text):
{
  "tasks": ["task1", "task2", "task3"],
  "achievements": ["achievement1", "achievement2"],
  "blockers": ["blocker1", "blocker2"],
  "nextWeekTasks": ["task1", "task2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        success: true,
        data: parsed,
      };
    }

    return {
      success: false,
      error: "Could not parse AI response",
    };
  } catch (error: any) {
    console.error("AI Service Error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}