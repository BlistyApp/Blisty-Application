import { Timestamp } from "firebase/firestore";

export interface MessageType {
  senderName: string;
  type: "contact" | "ia_suggestion";
  text: string;
  createdAt: Timestamp;
  userId: string;
}