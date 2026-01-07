import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environments";
import { Observable, Subject } from "rxjs";
import { Like } from "../models/Like";

@Injectable({
  providedIn: "root",
})
export class LikeService {
  private likeStatusSubject = new Subject<boolean>();
  likeStatus$ = this.likeStatusSubject.asObservable();

  constructor(private http: HttpClient) {}

  sendLike(momentId: number, token: string) {
    const likeUrl = `${environment.endpoint}${environment.like.replace(
      "${id}",
      momentId.toString()
    )}`;
    return this.http.post(likeUrl, {});
  }

  getLike(momentId: number, token: string): Observable<Like> {
    return this.http.get<Like>(
      `${environment.endpoint}${environment.like.replace(
        "${id}",
        momentId.toString()
      )}`
    );
  }

  updateLikeStatus(liked: boolean) {
    this.likeStatusSubject.next(liked);
  }
}
