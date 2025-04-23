import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Messages } from '../../models/Messages';
import { faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWindowMinimize, faWindowMaximize } from '@fortawesome/free-regular-svg-icons';
import { Profile } from '../../models/Profiles';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent {
  @Input() friend = new Profile({});
  @Output() closeChat = new EventEmitter<Profile>();
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  faPlane = faPaperPlane;
  faXmark = faXmark;
  faWindowMinimize = faWindowMinimize;
  faWindowMaximize = faWindowMaximize;
  isMinimized = false;
  userId = 1;
  messages: Messages[] = [
    { id: 1, senderId: 2, receiverId: 1, content: 'Olá!', createdAt: new Date() },
    { id: 2, senderId: 1, receiverId: 2, content: 'Oi! Como vai?', createdAt: new Date() },
  ];
  newMessage = '';

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

    this.scrollToBottom(); 

    setTimeout(() => {
      this.messages.push({
        id: this.messages.length + 1,
        senderId: 2,
        receiverId: this.userId,
        content: 'Mensagem recebida!',
        createdAt: new Date()
      });

      this.scrollToBottom(); 
    }, 1000);
  }

   scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    });
  }
  
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
  }

  
  close() {
    this.closeChat.emit(this.friend);
  }

}
