import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment/environments';
import { AuthorizationService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {


  constructor(
    private http: HttpClient,
    private authService: AuthorizationService,
  ) { }

  friendsList() {
    const headers = this.authService.getAuthorizationHeaders(); 
    return this.http.get(environment.endpoint + environment.getFriends, { headers });
  }
}
