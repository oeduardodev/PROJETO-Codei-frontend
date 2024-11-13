export class Profile {
  userId: number | null = null;
  photo: string | null = null;
  username: string | null = null;
  bio: string | null = null;
  technologies: string[] = [];
  friends: string[] = [];
  levels: string[] = [];
  profile: any;
  moments: any[] = [];
  
  constructor(data: any) {
    this.userId = data.user_id || null;
    this.photo = data.photo || null;
    this.bio = data.bio || null;
    this.technologies = data.technologies || [];
    this.friends = data.friends || [];
    this.levels = data.levels || [];
    this.moments = data.moments || []
  }
}
