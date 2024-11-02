export interface MessageType {
  senderName: string;
  type: "contact" | "ia_suggestion";
  text: string;
  createdAt: Date;
  userId: string;
}