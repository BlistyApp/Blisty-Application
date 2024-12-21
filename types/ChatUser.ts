import { Timestamp } from "firebase/firestore";

export interface ChatUser {
  name: string;
  profile_pic?: string;
  uid: string;
  lastMessage?: {
    fromUid: string;
    text: string;
    createdAt: Timestamp;
  };
}
