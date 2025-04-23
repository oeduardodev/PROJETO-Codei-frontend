import { Profile } from "./Profiles";
import { User } from "./User";

export class Moment {
  id: number;
  title = '';
  description = '';
  image = '';
  likes_count = 0;
  created_at: string;
  updated_at: string;
  comments: { text: string; username: string }[] = [];
  user: User;
  userId: number ;
  profile: Profile ;

  /*eslint-disable @typescript-eslint/no-explicit-any */
  constructor(data: any) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || '';
    this.image = data.image || '';
    this.likes_count = data.likes_count || 0;
    this.created_at = data.created_at 
    this.updated_at = data.updated_at 
    this.comments = data.comments || [];
    this.profile = data.profile 
    this.user = data.user;
    this.userId = data.user_id ;
  }

}
