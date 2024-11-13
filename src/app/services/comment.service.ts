import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../environment/environments';
import { Comment } from '../models/Comments';
import { Response } from '../models/Response';

@Injectable({
  providedIn: 'root',
})
export class CommentService {

  constructor(private http: HttpClient) { }

  createComment(data: Comment): Observable<Response<Comment>> {
    return this.http.post<Response<Comment>>(`${environment.endpoint}${environment.comment.replace('${id}', data.momentId.toString())}`, data);
  }
}

