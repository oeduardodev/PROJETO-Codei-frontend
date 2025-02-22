export class Profile {
  user_id: number = 0;
  photo: string = '';
  username: string = '';
  bio: string = '';
  technologies: string[] = [];
  friends: string[] = [];
  levels: string[] = [];
  moments: any[] = [];

  constructor(data: any) {
    const profile = data?.profile || {}; 

    this.user_id = profile.user_id ?? 0;
    this.photo = profile.photo ?? '';
    this.username = data?.username ?? '';
    this.bio = profile.bio ?? '';
    this.technologies = profile.technologies ?? [];
    this.friends = profile.friends ?? [];
    this.levels = profile.levels ?? [];
    this.moments = profile.moments ?? [];
  }
}
