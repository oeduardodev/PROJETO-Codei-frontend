import { Moment } from "./Moments";

export class Profile {
  readonly userId: number;
  photo = '';
  username = '';
  bio = '';
  technologies: string[] = [];
  friends: number[] = [];
  levels: string[] = [];
  moments: Moment[] = [];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  constructor(data: any) {
    this.userId = data.userId ?? data.user_id ?? 0;
    this.photo = data.photo ?? '';
    this.username = data.username ?? '';
    this.bio = data.bio ?? '';
    this.technologies = data.technologies ?? [];
    this.friends = data.friends ?? [];
    this.levels = data.levels ?? [];
    this.moments = data.moments ?? [];
  }
}

export interface ProfileResponse {
  profile: Profile;
}
