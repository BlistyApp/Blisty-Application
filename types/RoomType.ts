import { Timestamp } from "firebase/firestore";

interface UserRoomType {
  uid: string;
  name: string;
  profile_pic: string;
}

export interface RoomType {
  users: UserRoomType[];
  userIds: string[];
  roomId: string;
  createdAt: Timestamp;
  end: boolean;
}
