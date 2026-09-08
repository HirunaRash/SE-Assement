import { Router } from "express";
import { analyzeReport } from "../../Application/controllers/ai.controller";
import { authMiddleware } from "../middleware/auth/auth";

const router = Router();


router.post("/analyze", authMiddleware, analyzeReport);

export default router;