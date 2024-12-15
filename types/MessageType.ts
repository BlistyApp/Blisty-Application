import { Timestamp } from "firebase/firestore";

export interface MessageType {
  from: string;
  type: "contact" | "ia_suggestion" | "refresh_notification";
  text: string;
  psicoUids?: string[];
  createdAt: Timestamp;
  to: string;
}
