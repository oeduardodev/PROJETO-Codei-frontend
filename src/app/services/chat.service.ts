import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environments";
import { Chat } from "../models/Chat";
import { Observable, Subject, tap } from "rxjs";
import { io, Socket } from "socket.io-client";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private socket: Socket;
  private messageSubject = new Subject<Chat>();

  constructor(private http: HttpClient) {
    this.socket = io(environment.endpoint);

    this.socket.on("connect", () => {
      console.debug('[ChatService] socket connected', this.socket.id);
      // Opcional: enviar token para o socket se necessário
      const token = localStorage.getItem("authToken");
      if (token) {
        this.socket.emit("authenticate", { token });
        console.debug('[ChatService] emitted authenticate');
      }
    });

    this.socket.on('connect_error', (err) => {
      console.error('[ChatService] socket connect_error', err);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[ChatService] socket disconnected', reason);
    });

    this.socket.on("newMessage", (message) => {
      console.debug('[ChatService] newMessage', message);
      this.messageSubject.next(message);
    });
  }

  getMessagesStream(): Observable<Chat> {
    return this.messageSubject.asObservable();
  }

  getAllMessages(): Observable<Chat[]> {
    const url = `${environment.endpoint}${environment.getMessages}`;
    return this.http.get<Chat[]>(url).pipe(
      tap((messages) => console.debug('[ChatService] getAllMessages', url, messages)),
    );
  }

  getMessages(id: number): Observable<Chat[]> {
    const url = `${environment.endpoint}${environment.getMessagesById.replace(
      "${id}",
      id.toString(),
    )}`;
    return this.http.get<Chat[]>(url).pipe(
      tap((messages) => console.debug('[ChatService] getMessages', url, messages)),
    );
  }

  sendMessage(data: Chat): Observable<Chat> {
    const url = `${environment.endpoint}${environment.sendMessage}`;
    return this.http.post<Chat>(url, data).pipe(
      tap((saved) => console.debug('[ChatService] sendMessage', url, saved)),
    );
  }

  markRead(id: number): Observable<any> {
    const url = `${environment.endpoint}${environment.markAsRead.replace(
      "${id}",
      id.toString(),
    )}`;

    return this.http.post(url, {});
  }

  clear() {
    this.messageSubject = new Subject<Chat>();
  }

  joinRoom(userId: number) {
    this.socket.emit("join", userId);
  }

  authenticateSocket() {
    const token = localStorage.getItem("authToken");
    if (token) {
      this.socket.emit("authenticate", { token });
    }
  }
}
