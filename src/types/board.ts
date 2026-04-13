import { Timestamp } from "firebase/firestore";

export type Board = {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
  isPublic?: boolean;
};
