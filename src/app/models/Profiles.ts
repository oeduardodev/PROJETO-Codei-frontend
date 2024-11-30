export class Profile {
  userId: number | null = null;
  photo: string | null = null;
  username: string | null = null;
  bio: string | null = null;
  technologies: string[] = [];
  friends: string[] = [];
  levels: string[] = [];
  moments: any[] = [];

  constructor(data: any) {
    this.userId = data.profile.user_id || null;
    this.photo = data.profile.photo || null;
    this.username = data.username || null; // O username está fora de "profile"
    this.bio = data.profile.bio || null;
    this.technologies = data.profile.technologies || [];
    this.friends = data.profile.friends || [];
    this.levels = data.profile.levels || [];
    this.moments = data.profile.moments || [];
  }
}
