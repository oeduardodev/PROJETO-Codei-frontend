import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWindowMinimize, faWindowMaximize } from '@fortawesome/free-regular-svg-icons';
import { Profile } from '../../models/Profiles';
import { ChatService } from '../../services/chat.service';
import { Chat } from '../../models/Chat';
import { ProfileService } from '../../services/profile.service';
import { AuthorizationService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})

export class ChatComponent implements OnInit {
  @Input() friend = new Profile({});
  @Output() closeChat = new EventEmitter<Profile>();
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  faPlane = faPaperPlane;
  faXmark = faXmark;
  faWindowMinimize = faWindowMinimize;
  faWindowMaximize = faWindowMaximize;

  isMinimized = false;

  chatsMessages: Chat[] = [];
  newMessage = '';

  myId!: number;
  friendId!: number;


  profileData!: Profile;

  constructor(
    private chatService: ChatService,
    private profileService: ProfileService,
    private authService: AuthorizationService

  ) { }

  ngOnInit() {
    this.getMessages();

  }

  getMessages(): void {
    const headers = this.authService.getAuthorizationHeaders();

    this.profileService.getMyProfile().subscribe({
      next: (response) => {
        this.profileData = new Profile(response.profile);
        this.myId = this.profileData.userId;
        this.friendId = this.friend.userId;

        this.chatService.joinRoom(this.myId);

        if (!this.friendId || !this.myId) {
          console.warn('IDs inválidos:', this.myId, this.friendId);
          return;
        }

        this.chatService.getMessasges(this.friendId, headers).subscribe({
          next: (messages) => {
            this.chatsMessages = messages;
            this.scrollToBottom();
          },
          error: (err) => {
            console.error('Erro ao buscar mensagens:', err);
          }
        });

        this.initConversation();
      },
      error: (err) => {
        console.error('Erro ao obter perfil:', err);
      }
    });
  }

  initConversation() {
    this.chatService.getMessagesStream().subscribe({
      next: (newMessage: Chat) => {
        console.log('Nova mensagem recebida:', newMessage);
        if (
          (newMessage.sender_id === this.friend.userId && newMessage.receiver_id === this.myId) ||
          (newMessage.sender_id === this.myId && newMessage.receiver_id === this.friend.userId)
        ) {
          this.chatsMessages.push(newMessage);
          this.scrollToBottom();
        }
      },
      error: (err) => {
        console.error('Erro no stream de mensagens:', err);
      }
    });
  }
  sendMessage() {
    if (!this.newMessage.trim()) {
      return;
    }

    const message: Chat = {
      content: this.newMessage,
      sender: this.profileData.userId,
      receiver: this.friend.userId
    };

    const headers = this.authService.getAuthorizationHeaders();

    this.chatService.sendMessage(message, headers).subscribe({
      next: () => {
        this.newMessage = '';
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Erro ao enviar mensagem:', err);
      }
    });
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
