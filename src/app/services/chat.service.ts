
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environments';
import { Chat } from '../models/chat';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  messages = '';

  constructor(private http: HttpClient) {}

  getMessasges(id: number, headers: HttpHeaders): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${environment.endpoint}${environment.getMessagesById.replace('${id}', id.toString())}`, { headers });
  }

  clear() {
    this.messages = "";
  }
}