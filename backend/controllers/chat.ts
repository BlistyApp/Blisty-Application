import { Request, Response } from "express";
import { openai, systemPromt } from "../services/OpenAI";

export const chat = async (req: Request, res: Response) => {
  const uid = req.body?.uid;
  let messages = req.body?.messages;
  const user = req.body?.user;
  if (!uid || !user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const new_chat = messages ? false : true;
  if (new_chat) {
    const sys =
      "Nuevo chat, " +
      systemPromt +
      "Saluda por su nombre usuario: " +
      (user.displayName ?? "Indefinido, omitir el nombre de usuario");
    messages = [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: sys,
          },
        ],
      },
    ];
  }
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });
    let new_messages = messages;
    for (const mBlock of response.choices) {
      const role = mBlock.message.role;
      const content = mBlock.message.content;
      new_messages.push({
        role: role,
        content: content,
      });
    }
    console.log(new_messages);
    res.status(200).json(new_messages);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
