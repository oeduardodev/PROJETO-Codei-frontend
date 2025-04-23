import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environments';
import { Observable, Subject } from 'rxjs';
import { Like } from '../models/Like';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private likeStatusSubject = new Subject<boolean>(); 
  likeStatus$ = this.likeStatusSubject.asObservable(); 

  constructor(private http: HttpClient) {}

  sendLike(momentId: number, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const likeUrl = `${environment.endpoint}${environment.like.replace('${id}', momentId.toString())}`;
    return this.http.post(likeUrl, {}, { headers });
  }

  getLike(momentId: number, token: string): Observable<Like> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Like>(`${environment.endpoint}${environment.like.replace('${id}', momentId.toString())}`, { headers });
  }

  updateLikeStatus(liked: boolean) {
    this.likeStatusSubject.next(liked); 
  }
}
