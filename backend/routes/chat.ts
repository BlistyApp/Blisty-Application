import { Router } from "express";
import { chat } from "../controllers/chat";

const router = Router();

router.get("/api/chat/", chat);

export default router;
