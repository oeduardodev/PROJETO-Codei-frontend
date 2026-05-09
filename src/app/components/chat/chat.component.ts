import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  input,
  output,
  signal,
  OnInit,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWindowMaximize,
  faWindowMinimize,
} from "@fortawesome/free-regular-svg-icons";
import { RouterLink } from "@angular/router";
import { Chat } from "../../models/Chat";
import { Profile } from "../../models/Profiles";
import { ImageFallbackDirective } from "../../directives/image-fallback.directive";
import { ChatService } from "../../services/chat.service";
import { ProfileService } from "../../services/profile.service";

@Component({
  selector: "app-chat",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    RouterLink,
    ImageFallbackDirective,
  ],
  templateUrl: "./chat.component.html",
  styleUrl: "./chat.component.css",
})
export class ChatComponent implements OnInit {
  readonly friend = input.required<Profile>();
  readonly closed = output<Profile>();
  @ViewChild("messagesContainer") messagesContainer!: ElementRef;

  readonly faPlane = faPaperPlane;
  readonly faXmark = faXmark;
  readonly faWindowMinimize = faWindowMinimize;
  readonly faWindowMaximize = faWindowMaximize;

  readonly isMinimized = signal(false);
  readonly chatsMessages = signal<Chat[]>([]);
  readonly newMessage = signal("");
  readonly myId = signal(0);
  readonly profileData = signal<Profile | null>(null);
  readonly friendId = computed(() => this.friend().userId);

  constructor(
    private chatService: ChatService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.getMessages();
  }

  getMessages(): void {
    this.profileService.getMyProfile().subscribe({
      next: (response) => {
        const profile = new Profile(response.profile);
        const myId = profile.userId;
        const friendId = this.friendId();

        this.profileData.set(profile);
        this.myId.set(myId);
        this.chatService.joinRoom(myId);

        if (!friendId || !myId) {
          return;
        }

        this.chatService.getMessages(friendId).subscribe({
          next: (messages) => {
            this.chatsMessages.set(messages);
            this.scrollToBottom();
          },
        });

        this.initConversation();
      },
    });
  }

  initConversation(): void {
    this.chatService.getMessagesStream().subscribe({
      next: (newMessage: Chat) => {
        const normalized = this.normalizeMessage(newMessage as any);

        const isConversationMessage =
          (normalized.sender_id === this.friend().userId &&
            normalized.receiver_id === this.myId()) ||
          (normalized.sender_id === this.myId() &&
            normalized.receiver_id === this.friend().userId);

        if (!isConversationMessage) {
          return;
        }

        this.chatsMessages.update((messages) => {
          if (messages.some((m) => m.id === normalized.id)) return messages;
          return [...messages, normalized];
        });

        this.scrollToBottom();
      },
    });
  }

  sendMessage(): void {
    const content = this.newMessage().trim();
    const profile = this.profileData();

    if (!content || !profile) {
      return;
    }

    const message: Chat = {
      content,
      sender: profile.userId,
      receiver: this.friend().userId,
    };

    this.chatService.sendMessage(message).subscribe({
      next: (savedMessage: any) => {
        const normalized = this.normalizeMessage(savedMessage);

        this.chatsMessages.update((messages) => {
          if (messages.some((m) => m.id === normalized.id)) return messages;
          return [...messages, normalized];
        });

        this.newMessage.set("");
        this.scrollToBottom();
      },
    });
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    });
  }

  private normalizeMessage(m: any): Chat {
    return {
      ...m,
      sender_id:
        m.sender_id ?? m.senderId ?? m.sender?.id ?? m.sender?.userId ?? m.sender,
      receiver_id:
        m.receiver_id ?? m.receiverId ?? m.receiver?.id ?? m.receiver?.userId ?? m.receiver,
    } as Chat;
  }

  toggleMinimize(): void {
    this.isMinimized.update((isMinimized) => !isMinimized);
  }

  close(): void {
    this.closed.emit(this.friend());
  }
}
