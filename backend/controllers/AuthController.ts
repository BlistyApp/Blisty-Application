import { Response, Request, NextFunction } from "express";
import { firebaseApp } from "../services/Firebase";
import { ErrorInfo } from "firebase-admin/lib/utils/error";
import { UserData } from "../Entities/UserData";
import jwt from "jsonwebtoken";

class AuthController {
  static register = async (req: Request, res: Response) => {
    const {
      email,
      password,
      name,
    }: { email: string; password: string; name: string } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password and name are required" });
      return;
    }
    const auth = firebaseApp.auth();
    try {
      const user = await auth.createUser({
        email: email,
        password: password,
        emailVerified: false,
        displayName: name,
      });
      const accessToken = jwt.sign(
        { uid: user.uid },
        process.env.ACCESS_TOKEN_KEY as string,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { uid: user.uid },
        process.env.REFRESH_TOKEN_KEY as string,
        { expiresIn: "3d" }
      );
      const userData: UserData = {
        email: user.email as string,
        name: user.displayName as string,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
      res.status(201).json(userData);
      return;
    } catch (error: any) {
      console.log(error);
      this.errorHandling(error, res);
      return;
    }
  };
  static login = async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const auth = firebaseApp.auth();
    try {
      const user = await auth.getUserByEmail(email);
      const accessToken = jwt.sign(
        { uid: user.uid },
        process.env.ACCESS_TOKEN_KEY as string,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { uid: user.uid },
        process.env.REFRESH_TOKEN_KEY as string,
        { expiresIn: "3d" }
      );
      const userData: UserData = {
        email: user.email as string,
        name: user.displayName as string,
        accessToken: accessToken as string,
        refreshToken: refreshToken as string,
      };
      console.log(userData);
      res.status(200).json(userData);
    } catch (error: any) {
      this.errorHandling(error, res);
    }
  };
  static jwtVerifyAndRefresh = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "No authorization headers" });
      return;
    }
    const accessToken = authHeader.split(" ")[1];
    const refreshToken =
      req.headers["x-refresh-token"] || req.body.refreshToken;
    if (!accessToken || !refreshToken) {
      res.status(401).json({ error: "No authorization headers" });
      return;
    }
    jwt.verify(
      refreshToken as string,
      process.env.REFRESH_TOKEN_KEY as string,
      (err, _decoded) => {
        if (err?.name == "TokenExpiredError") {
          jwt.verify(
            refreshToken as string,
            process.env.REFRESH_TOKEN_KEY as string,
            (err, decoded) => {
              if (err) {
                res.status(401).json({ error: "Invalid refresh token" });
                return;
              }
              if (!decoded) {
                res.status(401).json({ error: "Invalid refresh token" });
                return;
              }
              const accessToken = jwt.sign(
                { uid: (decoded as any).uid },
                process.env.ACCESS_TOKEN_KEY as string,
                { expiresIn: "1h" }
              );
              res.setHeader("Authorization", `Bearer ${accessToken}`);
            }
          );
        } else if (!err) {
          next();
          return;
        } else {
          res.status(401).json({ error: "Invalid access token" });
          return;
        }
      }
    );
    next();
  };
  static errorHandling = (error: any, res: Response) => {
    if (error.code) {
      const errorInfo = error as ErrorInfo;
      const errorResponses = {
        "auth/user-not-found": "User not found",
        "auth/wrong-password": "Wrong password",
        "auth/invalid-email": "Invalid email",
        "auth/email-already-exists": "Email already exists",
        "auth/weak-password": "Weak password",
      };
      const errorMessage =
        errorResponses[errorInfo.code as keyof typeof errorResponses] ||
        errorInfo.code;
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: "Internal server error -" });
    }
  };
}

export default AuthController;
