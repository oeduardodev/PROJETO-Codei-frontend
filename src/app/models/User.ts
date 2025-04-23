import { Moment } from "./Moments";
import { Profile } from "./Profiles";

export class User {
  id: number
  username: string;
  email: string;
  password: string;
  isAdmin = false;
  createdAt: string;
  updatedAt: string;
  profile: Profile;
  moments: Moment;
  photo: string;

  /* eslint-disable @typescript-eslint/no-explicit-any */
  constructor(data: any) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.isAdmin = data.is_admin;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
    this.photo = data.photo;
    // Dados do perfil
    this.profile = new Profile(data.profile);

    // Dados dos momentos
    this.moments = data.moments;
  }
}
