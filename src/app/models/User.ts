import { Profile } from "./Profiles";

export class User {
  id: number
  username: string | null = null;
  email: string | null = null;
  password: string | null = null;
  isAdmin: boolean = false;
  createdAt: string | null = null;
  updatedAt: string | null = null;
  profile: Profile | null = null;
  moments: any | null = null;

  constructor(data: any) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.isAdmin = data.is_admin;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;

    // Dados do perfil
    this.profile = new Profile(data.profile);

    // Dados dos momentos
    this.moments = data.moments;
  }
}
