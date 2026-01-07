import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environment/environments";
import { Chat } from "../models/Chat";
import { Observable, Subject } from "rxjs";
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
      console.log("Conectado ao WebSocket");
      // Opcional: enviar token para o socket se necessário
      const token = localStorage.getItem("authToken");
      if (token) {
        this.socket.emit("authenticate", { token });
      }
    });

    this.socket.on("newMessage", (message) => {
      console.log("Mensagem recebida em tempo real:", message);
      this.messageSubject.next(message);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Erro de conexão WebSocket:", error);
    });
  }

  getMessagesStream(): Observable<Chat> {
    return this.messageSubject.asObservable();
  }

  getAllMessages(): Observable<Chat[]> {
    const url = `${environment.endpoint}${environment.getMessages}`;
    return this.http.get<Chat[]>(url);
  }

  getMessages(id: number): Observable<Chat[]> {
    const url = `${environment.endpoint}${environment.getMessagesById.replace(
      "${id}",
      id.toString()
    )}`;
    console.log("Buscando mensagens de:", url);
    return this.http.get<Chat[]>(url);
  }

  sendMessage(data: Chat): Observable<Chat> {
    const url = `${environment.endpoint}${environment.sendMessage}`;
    console.log("Enviando mensagem para:", url);
    return this.http.post<Chat>(url, data);
  }

  markRead(id: number): Observable<any> {
    const url = `${environment.endpoint}${environment.markAsRead.replace(
      "${id}",
      id.toString()
    )}`;

    console.log("Marcando mensagens como lidas:", url);

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
