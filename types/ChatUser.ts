import { Timestamp } from "firebase/firestore";

export interface ChatUser {
  name: string;
  profilePic?: string;
  uid: string;
  lastMessage?: {
    fromUid: string;
    text: string;
    createdAt: Timestamp;
  };
}
