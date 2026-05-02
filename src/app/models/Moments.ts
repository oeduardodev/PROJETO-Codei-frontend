import { Profile } from "./Profiles";
import { User } from "./User";
import { Comment } from "./Comments";

export class Moment {
  id: number;
  title = '';
  description = '';
  likes_count = 0;
  created_at: string;
  updated_at: string;
  photo: string;

  comments: Comment[] = [];
  user: User;
  userId: number ;
  profile: Profile ;

  /*eslint-disable @typescript-eslint/no-explicit-any */
  constructor(data: any) {
    this.id = data.id;
    this.title = data.title ;
    this.description = data.description;
    this.photo = data.photo;
    this.likes_count = data.likes_count || 0;
    this.created_at = data.created_at ;
    this.updated_at = data.updated_at;
    this.comments = data.comments || [];
    this.profile = data.profile ;
    this.user = data.user;
    this.userId = data.user_id ;
  }

}
