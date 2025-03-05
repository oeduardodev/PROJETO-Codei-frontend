import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Messages } from '../../models/Messages';
import { faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWindowMinimize } from '@fortawesome/free-regular-svg-icons';
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit{
  @Input() friend: any; // Amigo com quem está conversando
  faPlane = faPaperPlane;
  faXmark = faXmark;
  faWindowMinimize = faWindowMinimize;
  userId = 1; // ID do usuário logado (mockado por enquanto)
  messages: Messages[] = [
    { id: 1, senderId: 2, receiverId: 1, content: 'Olá!', createdAt: new Date() },
    { id: 2, senderId: 1, receiverId: 2, content: 'Oi! Como vai?', createdAt: new Date() },
  ];
  newMessage: string = '';
  ngOnInit(): void {
    console.log(this.friend);
  }
  sendMessage() {
    if (!this.newMessage.trim()) return;
    const message: Messages = {
      id: this.messages.length + 1,
      senderId: this.userId,
      receiverId: 2, 
      content: this.newMessage,
      createdAt: new Date()
    };
    
    this.messages.push(message);
    this.newMessage = '';
    
    // Simula resposta automática
    setTimeout(() => {
      this.messages.push({
        id: this.messages.length + 1,
        senderId: 2,
        receiverId: this.userId,
        content: 'Mensagem recebida!',
        createdAt: new Date()
      });
    }, 1000);
  }
}
