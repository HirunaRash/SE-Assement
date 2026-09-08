import { Router } from "express";
import { analyzeReport } from "../../Application/controllers/ai.controller";
import { authMiddleware } from "../middleware/auth/auth";

const router = Router();

// POST /api/ai/analyze - Analyze report description
router.post("/analyze", authMiddleware, analyzeReport);

export default router;