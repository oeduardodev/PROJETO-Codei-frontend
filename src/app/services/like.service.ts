import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../environment/environments';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LikeService {

  constructor(private http: HttpClient) { }

  sendLike(momentId: number, token: string): Observable <any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const likeUrl = `${environment.endpoint}${environment.like.replace('${id}', momentId.toString())}`;
    console.log(likeUrl)
    return this.http.post(likeUrl, {}, { headers });
  }
  getLike(momentId: number, token: string): Observable <any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${environment.endpoint}${environment.like.replace('${id}', momentId.toString())}`, { headers });
  }
}
