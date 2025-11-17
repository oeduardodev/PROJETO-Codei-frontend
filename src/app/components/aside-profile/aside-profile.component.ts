import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ProfileService } from "../../services/profile.service";
import { Profile } from "../../models/Profiles";
import { NotificationUser } from "../../models/Notifications";
import { TypesNotificacaoEnum } from "../../enum/notifications.enum";

@Component({
  selector: "app-aside-profile",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./aside-profile.component.html",
  styleUrls: ["./aside-profile.component.css"],
})
export class AsideProfileComponent implements OnInit {
  userProfile: Profile | null = null;
  perfilCompleted = false;
  notifications: NotificationUser[] = [];
  urlProfile: string = "";

  friendRequest: boolean = false;

  constructor(private profileService: ProfileService) {}

  ngOnInit() {
    this.getUserData();
    this.getMyNotifications();
  }

  getUserData() {
    this.profileService.getMyProfile().subscribe((data) => {
      this.userProfile = new Profile(data.profile);

      if (
        this.userProfile.photo &&
        this.userProfile.technologies &&
        this.userProfile.bio
      ) {
        this.perfilCompleted = true;
      }
    });
  }

  getMyNotifications() {
    this.profileService.getNotifications().subscribe((data) => {
      console.log("notificações", data);
      this.notifications = data;
      this.sendFriendRequestProfile();
    });
  }
  getNotificationLink(notification: NotificationUser): string | null {
    switch (notification.type) {
      case TypesNotificacaoEnum.FRIEND_REQUEST:
        return `/profile/${notification.data?.fromUserId}`;

      case TypesNotificacaoEnum.FRIEND_POST:
        return `/moments/${notification.data?.momentId}`;

      case TypesNotificacaoEnum.LIKE:
        return `/moments/${notification.data?.momentId}`;

      case TypesNotificacaoEnum.COMMENT:
        return `/moments/${notification.data?.momentId}`;

      default:
        return null;
    }
  }

  sendFriendRequestProfile() {
    if (this.notifications.find((n) => n.type.includes("friend_request")))
      this.friendRequest = true;
    this.urlProfile = `/profile/${this.notifications[0].data?.fromUserId}`;
    console.log("Ir para o perfil:", this.urlProfile);
  }
}
