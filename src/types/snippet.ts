import { Timestamp } from "firebase/firestore";

export type Snippet = {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: Timestamp;
  userId: string;
};
