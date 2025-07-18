import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environments';
import { AuthorizationService } from './auth.service';
import { Observable } from 'rxjs';
import { Profile } from '../models/Profiles';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {


  constructor(
    private http: HttpClient,
    private authService: AuthorizationService,
  ) { }

  friendsList(): Observable<{ myFriends: Profile[] }> {
    const headers = this.authService.getAuthorizationHeaders();
    return this.http.get<{ myFriends: Profile[] }>(
      environment.endpoint + environment.getFriends,
      { headers }
    );
  }

  addFriend(id: number) {
    const headers = this.authService.getAuthorizationHeaders();
    return this.http.post(
      `${environment.endpoint}${environment.addFriend.replace('${id}', id.toString())}`,
      {},
      { headers }
    );
  }
}
