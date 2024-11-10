import express from "express";
import morgan from "morgan";
import { Credentials } from "./entities/Credentials";
import { getHashedCredentials } from "./services/CredentialsEncryption";
import { getAuth } from "firebase-admin/auth";
import { fbAdmin } from "./services/Firebase";
import { openai, systemPromt } from "./services/OpenAI";
require("dotenv").config();

const server = express();
const port = process.env.PORT || 3000;

server.use(morgan("dev"));
server.use(express.json());

server.get("/api/credentials", async (_req, res) => {
  const cred: Credentials = await getHashedCredentials();
  res.status(200).json(cred);
});

server.get("/api/chat/:uid", async (req, res) => {
  const auth = getAuth(fbAdmin);
  const uid = req.params.uid;
  let messages = req.body.messages;
  const new_chat = req.body.new_chat;
  if (!new_chat) {
    res.status(404).json({ message: "New chat parameter is required" });
    return;
  }
  try {
    const user = await auth.getUser(uid);
    let system =
      systemPromt +
      "Saluda por su nombre usuario: " +
      (user.displayName ?? "Indefinido, omitir el nombre de usuario");
    if (new_chat) {
      system += "Nuevo chat";
      messages = [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: system,
            },
          ],
        },
      ];
    }
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(404).json({ message: "User not found" });
    return;
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
