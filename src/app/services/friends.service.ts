import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../environment/environments";
import { AuthorizationService } from "./auth.service";
import { Observable } from "rxjs";
import { Profile } from "../models/Profiles";

@Injectable({
  providedIn: "root",
})
export class FriendsService {
  constructor(
    private http: HttpClient,
    private authService: AuthorizationService
  ) {}

  friendsList(): Observable<{ myFriends: Profile[] }> {
    return this.http.get<{ myFriends: Profile[] }>(
      environment.endpoint + environment.getFriends
    );
  }

  friendsById(id: number): Observable<{ myFriends: Profile[] }> {
    return this.http.get<{ myFriends: Profile[] }>(
      environment.endpoint +
        environment.getFriendsById.replace("${id}", id.toString())
    );
  }

  addFriend(id: number) {
    const url = `${environment.endpoint}${environment.addFriend}`;
    return this.http.post(url, { friendId: id });
  }

  removeFriend(id: number) {
    return this.http.delete(
      `${environment.endpoint}${environment.removeFriend.replace(
        "${id}",
        id.toString()
      )}`
    );
  }
}
