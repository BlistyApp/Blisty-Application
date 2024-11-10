import express from "express";
import morgan from "morgan";
import { Credentials } from "./entities/Credentials";
import { getHashedCredentials } from "./services/CredentialsEncryption";
import ChatRouter from "./routes/chat";
require("dotenv").config();

const server = express();
const port = process.env.PORT || 3000;

server.use(morgan("dev"));
server.use(express.json());

server.get("/api/credentials", async (_req, res) => {
  const cred: Credentials = await getHashedCredentials();
  res.status(200).json(cred);
});

server.use(ChatRouter);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
