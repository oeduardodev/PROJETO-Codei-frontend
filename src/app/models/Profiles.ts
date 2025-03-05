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
    this.user_id = data.user_id ?? 0;
    this.photo = data.photo ?? '';
    this.username = data.username ?? '';
    this.bio = data.bio ?? '';
    this.technologies = data.technologies ?? [];
    this.friends = data.friends ?? [];
    this.levels = data.levels ?? [];
    this.moments = data.moments ?? [];
  }
}
