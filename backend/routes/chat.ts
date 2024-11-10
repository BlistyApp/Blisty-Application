import { Router } from "express";
import { chat } from "../controllers/Chat";

const router = Router();

router.get("/api/chat/", chat);

export default router;
