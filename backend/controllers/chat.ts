import { Request, Response } from "express";
import { openai, systemPromt } from "../services/OpenAI";
import { ChatResponse } from "../entities/Messages";

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
      systemPromt +
      ", Saluda por su nombre usuario: " +
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
    const apiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    });
    let new_messages = messages;
    let tags: Array<string> = [];
    let masterTags: Array<string> = [];
    let endChat = false;
    let chatResponse: ChatResponse;
    for (const mBlock of apiResponse.choices) {
      const role = mBlock.message.role;
      const content = mBlock.message.content;
      const tagsMatch = content?.match(/<Tags>\[(.*?)\]<\/Tags>/);
      const masterTagsMatch = content?.match(/<MTags><\/MTags>/);
      const endChatMatch = content?.match(/<End-Chat-Blisty>/);
      if (tagsMatch) {
        tags = tagsMatch[1].split(", ").map((tag) => tag.trim());
      }
      if (masterTagsMatch) {
        masterTags = masterTagsMatch[1].split(", ").map((tag) => tag.trim());
      }
      if (endChatMatch) {
        endChat = true;
      }
      new_messages.push({
        role: role,
        content: content,
      });
    }
    chatResponse = {
      messages: new_messages,
      uid: uid,
      tags: tags,
      masterTags: masterTags,
      endChat: endChat,
    };
    res.status(200).json(chatResponse);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal server error" });
  }
};
