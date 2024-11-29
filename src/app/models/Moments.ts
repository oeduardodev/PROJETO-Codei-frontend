import { User } from "./User";

export interface Moment {
  id?: number;
  title: string;
  description: string;
  image: string;
  likes_count: number;
  created_at?: string;
  updated_at?: string;
  comments?: [{ text: string; username: string }];
  user?: User
}
