export class Profile {
  userId: number = 0;
  photo: string = '';
  username: string = '';
  bio: string = '';
  technologies: string[] = [];
  friends: string[] = [];
  levels: string[] = [];
  moments: any[] = [];

  constructor(data: any) {
    const profile = data?.profile || {}; // Garantir que `profile` seja um objeto, mesmo que vazio

    this.userId = profile.user_id ?? 0;
    this.photo = profile.photo ?? '';
    this.username = data?.username ?? '';
    this.bio = profile.bio ?? '';
    this.technologies = profile.technologies ?? [];
    this.friends = profile.friends ?? [];
    this.levels = profile.levels ?? [];
    this.moments = profile.moments ?? [];
  }
}
