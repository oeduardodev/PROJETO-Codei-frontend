import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { RouterModule } from "@angular/router";
import { TypesNotificacaoEnum } from "../../enum/notifications.enum";
import { NotificationUser } from "../../models/Notifications";
import { Profile } from "../../models/Profiles";
import { ImageFallbackDirective } from "../../directives/image-fallback.directive";
import { AuthorizationService } from "../../services/auth.service";
import { MenuService } from "../../services/menu.service";
import { ProfileService } from "../../services/profile.service";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-aside-profile",
  standalone: true,
  imports: [CommonModule, FaIconComponent, RouterModule, ImageFallbackDirective],
  templateUrl: "./aside-profile.component.html",
  styleUrls: ["./aside-profile.component.css"],
})
export class AsideProfileComponent {
  readonly faCheck = faCheck;
  readonly menuOpen = this.menuService.menuOpen;
  readonly userProfile = signal<Profile | null>(null);
  readonly notifications = signal<NotificationUser[]>([]);

  readonly perfilCompleted = computed(() => {
    const profile = this.userProfile();
    return !!(profile?.photo && profile.technologies?.length && profile.bio);
  });
  readonly hasUnreadNotifications = computed(
    () => this.notifications().length > 0,
  );

  constructor(
    private profileService: ProfileService,
    public usersService: UsersService,
    private authService: AuthorizationService,
    private menuService: MenuService,
  ) {
    if (this.authService.isAuthenticated()) {
      this.getUserData();
      this.getMyNotifications();
    }
  }

  getUserData(): void {
    this.profileService.getMyProfile().subscribe((data) => {
      this.userProfile.set(new Profile(data.profile));
    });
  }

  getMyNotifications(): void {
    this.profileService.getNotifications().subscribe((data: any[]) => {
      this.notifications.set(
        data.filter((notification) => notification.read === 0),
      );
    });
  }

  getNotificationLink(notification: NotificationUser): string | null {
    switch (notification.type) {
      case TypesNotificacaoEnum.FRIEND_REQUEST:
        return `/profile/${notification.data?.fromUserId}`;
      case TypesNotificacaoEnum.FRIEND_POST:
      case TypesNotificacaoEnum.LIKE:
      case TypesNotificacaoEnum.COMMENT:
        return `/moments/${notification.data?.momentId}`;
      default:
        return null;
    }
  }

  clearNotification(id: number): void {
    this.profileService.clearNotifications(id).subscribe(() => {
      this.notifications.update((notifications) =>
        notifications.filter((notification) => notification.id !== id),
      );
    });
  }

  markAllAsRead(): void {
    const unreadNotifications = this.notifications();

    unreadNotifications.forEach((notification) => {
      this.profileService.clearNotifications(notification.id).subscribe();
    });

    this.notifications.set([]);
  }

  closeMenu(): void {
    this.menuService.closeMenu();
  }
}
