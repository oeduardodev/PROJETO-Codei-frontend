import { Component, OnInit } from "@angular/core";
import { FriendsService } from "../../services/friends.service";
import { CommonModule } from "@angular/common";
import { ChatComponent } from "../chat/chat.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Profile } from "../../models/Profiles";
import { ChatService } from "../../services/chat.service";
import { AuthorizationService } from "../../services/auth.service";
import { ProfileService } from "../../services/profile.service";
import { Chat } from "../../models/Chat";

@Component({
  selector: "app-aside-friends",
  standalone: true,
  imports: [CommonModule, ChatComponent, FontAwesomeModule],
  templateUrl: "./aside-friends.component.html",
  styleUrls: ["./aside-friends.component.css"],
})
export class AsideFriendsComponent implements OnInit {
  friendsListComplate: Profile[] = [];
  selectedFriends: Profile[] = [];
  selectedFriendsChats: Record<number, Profile[]> = {};
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  isMinimized = false;

  newMessage = "";

  myId!: number;
  friendId!: number;
  profileData!: Profile;

  notifications: Record<number, boolean> = {};

  constructor(
    private friendsService: FriendsService,
    private chatService: ChatService,
    private authService: AuthorizationService,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.friendsList();
      this.getMessages();
    }
  }
  getMessages(): void {
    this.profileService.getMyProfile().subscribe({
      next: () => {
        this.chatService.getAllMessages().subscribe((messages) => {
          this.notifications = {};

          messages.forEach((msg: any) => {
            // Mensagem recebida e não lida
            if (msg.read !== 1) {
              this.notifications[msg.sender_id] = true;
            }
          });
        });
      },
      error: (err) => {
        console.error("Erro ao obter perfil:", err);
      },
    });
  }

  hasNotifications(friendId: number): boolean {
    return !!this.notifications[friendId];
  }

  friendsList() {
    this.friendsService.friendsList().subscribe((data) => {
      const friendsData = data;
      this.friendsListComplate = friendsData.myFriends.map(
        (f: Profile) => new Profile(f)
      );
    });
  }

  openChat(friend: Profile) {
    if (this.selectedFriends.some((f) => f.userId === friend.userId)) {
      return;
    }

    if (this.selectedFriends.length >= 5) {
      return;
    }

    this.selectedFriends = [...this.selectedFriends, friend];

    delete this.notifications[friend.userId];

    this.friendMessageNotification(friend.userId);
  }

  closeChat(friend: Profile) {
    this.selectedFriends = this.selectedFriends.filter(
      (f) => f.userId !== friend.userId
    );
  }

  friendMessageNotification(friendId: number) {
    this.chatService.markRead(friendId).subscribe();
  }
}
