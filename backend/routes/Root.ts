import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({
    message: "Hello, world!",
  });
});

export default router;
