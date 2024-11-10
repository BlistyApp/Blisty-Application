import { NextFunction, Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";
import { fbAdmin } from "../services/Firebase";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(fbAdmin);
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.body.uid = decodedToken.uid;
    const user = await auth.getUser(decodedToken.uid);
    req.body.user = user;
    next();
  } catch (e) {
    console.log(e);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
