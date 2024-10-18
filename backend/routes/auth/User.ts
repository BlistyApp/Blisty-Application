import { Router } from "express";
import AuthController from "../../controllers/AuthController";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/protected", AuthController.jwtVerifyAndRefresh, (_req, res) => {
  res.status(200).json({ message: "You are authorized" });
});

export default router;
