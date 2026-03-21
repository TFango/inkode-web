import { Timestamp } from "firebase/firestore";

export type Snippets = {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: Timestamp;
  userId: string;
};
