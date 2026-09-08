import { analyzeReportDescription } from "../../Domain/services/ai.service";

export async function analyzeReport(req: any, res: any) {
  try {
    const { message } = req.body;
    const userId = req.userId;

    // Validate input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    // Call AI service
    const result = await analyzeReportDescription(message);

    if (!result.success) {
      return res.status(500).json({
        error: result.error,
      });
    }

    res.status(200).json({
      data: result.data,
    });
  } catch (error: any) {
    console.error("AI Controller Error:", error);
    res.status(500).json({
      error: "Internal server error",
    });
  }
}