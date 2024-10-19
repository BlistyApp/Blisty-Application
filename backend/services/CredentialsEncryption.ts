import crypto from "crypto";
import { Credentials } from "../entities/Credentials";
require("dotenv").config();

const secretKey = process.env.SECRET_KEY ?? "";
const algotithm = process.env.ALGORITHM ?? "";

if (Buffer.byteLength(secretKey) !== 32) {
  throw new Error("Secret key must be 32 bytes long");
}

const encrypt = (str: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algotithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(str, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
};

const getCredentials = async (): Promise<Credentials> => {
  const cred: Credentials = {
    apiKey: process.env.API_KEY ?? "",
    authDomain: process.env.AUTH_DOMAIN ?? "",
    projectId: process.env.PROJECT_ID ?? "",
    storageBucket: process.env.STORAGE_BUCKET ?? "",
    messagingSenderId: process.env.MESSAGING_SENDER_ID ?? "",
    appId: process.env.APP_ID ?? "",
  };
  return cred;
};

const getHashedCredentials = async (): Promise<Credentials> => {
  const cred: Credentials = {
    apiKey: encrypt(process.env.API_KEY ?? ""),
    authDomain: encrypt(process.env.AUTH_DOMAIN ?? ""),
    projectId: encrypt(process.env.PROJECT_ID ?? ""),
    storageBucket: encrypt(process.env.STORAGE_BUCKET ?? ""),
    messagingSenderId: encrypt(process.env.MESSAGING_SENDER_ID ?? ""),
    appId: encrypt(process.env.APP_ID ?? ""),
  };
  return cred;
};

export { getCredentials, getHashedCredentials };
