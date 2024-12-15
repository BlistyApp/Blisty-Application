import { Timestamp } from "firebase/firestore";

interface UserRoomType {
  uid: string;
  name: string;
  profilePic: string;
}

export interface RoomType {
  users: UserRoomType[];
  userIds: string[];
  roomId: string;
  createdAt: Timestamp;
  end: boolean;
}
