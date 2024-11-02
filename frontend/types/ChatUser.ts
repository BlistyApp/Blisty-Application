export interface ChatUser {
  name: string;
  profilePic?: string;
  uid: string;
  lastMessage: {
    text: string;
    time: string;
  };
}
