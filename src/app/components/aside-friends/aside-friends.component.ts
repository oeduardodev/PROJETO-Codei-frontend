import { CommonModule } from "@angular/common";
import { Component, signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Profile } from "../../models/Profiles";
import { ImageFallbackDirective } from "../../directives/image-fallback.directive";
import { AuthorizationService } from "../../services/auth.service";
import { ChatService } from "../../services/chat.service";
import { FriendsService } from "../../services/friends.service";
import { ProfileService } from "../../services/profile.service";
import { ChatComponent } from "../chat/chat.component";
import { ProfileSearchComponent } from "../modal-search/profile-search.component";

@Component({
  selector: "app-aside-friends",
  standalone: true,
  imports: [
    CommonModule,
    ChatComponent,
    FontAwesomeModule,
    ProfileSearchComponent,
    ImageFallbackDirective,
  ],
  templateUrl: "./aside-friends.component.html",
  styleUrls: ["./aside-friends.component.css"],
})
export class AsideFriendsComponent {
  readonly friends = signal<Profile[]>([]);
  readonly selectedFriends = signal<Profile[]>([]);
  readonly notifications = signal<Record<number, boolean>>({});
  readonly isProfileSearchOpen = signal(false);

  constructor(
    private friendsService: FriendsService,
    private chatService: ChatService,
    private authService: AuthorizationService,
    private profileService: ProfileService,
  ) {
    if (this.authService.isAuthenticated()) {
      this.friendsList();
      this.getMessages();
    }
  }

  getMessages(): void {
    this.profileService.getMyProfile().subscribe({
      next: () => {
        this.chatService.getAllMessages().subscribe((messages) => {
          const unreadNotifications: Record<number, boolean> = {};

          messages.forEach((message: any) => {
            const senderId =
              message.sender_id ?? message.senderId ?? message.sender?.id ?? message.sender?.userId;
            const isRead = message.read === true || message.read === 1 || message.read === '1';

            if (senderId && !isRead) {
              unreadNotifications[senderId] = true;
            }
          });

          this.notifications.set(unreadNotifications);
        });
      },
    });
  }

  hasNotifications(friendId: number): boolean {
    return !!this.notifications()[friendId];
  }

  friendsList(): void {
    this.friendsService.friendsList().subscribe((data) => {
      this.friends.set(data.myFriends.map((friend: Profile) => new Profile(friend)));
    });
  }

  openChat(friend: Profile): void {
    if (this.selectedFriends().some((item) => item.userId === friend.userId)) {
      return;
    }

    if (this.selectedFriends().length >= 5) {
      return;
    }

    this.selectedFriends.update((selectedFriends) => [...selectedFriends, friend]);
    this.notifications.update((notifications) => {
      const updatedNotifications = { ...notifications };
      delete updatedNotifications[friend.userId];
      return updatedNotifications;
    });

    this.friendMessageNotification(friend.userId);
  }

  closeChat(friend: Profile): void {
    this.selectedFriends.update((selectedFriends) =>
      selectedFriends.filter((item) => item.userId !== friend.userId),
    );
  }

  openProfileSearch(): void {
    this.isProfileSearchOpen.set(true);
  }

  closeProfileSearch(): void {
    this.isProfileSearchOpen.set(false);
  }

  friendMessageNotification(friendId: number): void {
    this.chatService.markRead(friendId).subscribe();
  }
}
