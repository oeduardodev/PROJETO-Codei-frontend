import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProfileService } from "../../services/profile.service";
import { Profile } from "../../models/Profiles";
import { NotificationUser } from "../../models/Notifications";
import { TypesNotificacaoEnum } from "../../enum/notifications.enum";
import { UsersService } from "../../services/users.service";
import { AuthorizationService } from "../../services/auth.service";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: "app-aside-profile",
  standalone: true,
  imports: [CommonModule, FaIconComponent, RouterModule],
  templateUrl: "./aside-profile.component.html",
  styleUrls: ["./aside-profile.component.css"],
})
export class AsideProfileComponent implements OnInit {
  userProfile: Profile | null = null;
  perfilCompleted = false;
  notifications: NotificationUser[] = [];
  faCheck = faCheck;

  constructor(
    private profileService: ProfileService,
    public usersService: UsersService,
    private authService: AuthorizationService
  ) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.getUserData();
      this.getMyNotifications();
    }
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
    this.profileService.getNotifications().subscribe((data: any[]) => {
      this.notifications = data.filter(
        (notification) => notification.read === 0
      );
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

  clearNotification(id: number) {
    this.profileService.clearNotifications(id).subscribe(() => {
      // Atualiza a lista removendo a notificação
      this.notifications = this.notifications.filter((n) => n.id !== id);
    });
  }

  markAllAsRead() {
    // Marca todas as notificações como lidas
    this.notifications.forEach((notification) => {
      this.profileService.clearNotifications(notification.id).subscribe();
    });
    // Limpa a lista localmente
    this.notifications = [];
  }
}
