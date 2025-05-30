import { User } from "./User";

export interface Chat {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  sender: User;
  receiver: User;
}