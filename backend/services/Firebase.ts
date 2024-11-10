require("dotenv").config();
import { initializeApp, cert, ServiceAccount } from "firebase-admin/app";

const serviceAccount: ServiceAccount = {
  projectId: process.env.ADMIN_PROJECT_ID,
  privateKey: process.env.ADMIN_PRIVATE_KEY,
  clientEmail: process.env.ADMIN_CLIENT_EMAIL,
};

export const fbAdmin = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});
