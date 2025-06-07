import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environment/environments';
import { Chat } from '../models/Chat';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;
  private messageSubject = new Subject<Chat>();

  constructor(private http: HttpClient) {
    this.socket = io(environment.endpoint);

    this.socket.on('connect', () => {
    });

    this.socket.on('newMessage', (message) => {
      console.log('Mensagem recebida em tempo real:', message)
      this.messageSubject.next(message);
    })

  }

  getMessagesStream(): Observable<Chat> {
    return this.messageSubject.asObservable();
  }

  getMessasges(id: number, headers: HttpHeaders): Observable<Chat[]> {
    return this.http.get<Chat[]>(`${environment.endpoint}${environment.getMessagesById.replace('${id}', id.toString())}`, { headers });
  }

  sendMessage(data: Chat, headers: HttpHeaders): Observable<Chat> {
    return this.http.post<Chat>(`${environment.endpoint}${environment.sendMessage}`, data, { headers });
  }

  clear() {
    this.messageSubject = new Subject<Chat>();
  }

  joinRoom(userId: number) {
    this.socket.emit('join', userId);
  }

}
