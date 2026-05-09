import { CommonModule } from "@angular/common";
import { Component, computed, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faShareFromSquare,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Router } from "@angular/router";
import { Profile } from "../../models/Profiles";
import { ImageFallbackDirective } from "../../directives/image-fallback.directive";
import { ProfileService } from "../../services/profile.service";

@Component({
  selector: "app-profile-search",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ImageFallbackDirective,
  ],
  templateUrl: "./profile-search.component.html",
  styleUrl: "./profile-search.component.css",
})
export class ProfileSearchComponent {
  readonly closed = output<void>();
  readonly faShare = faShareFromSquare;
  readonly faFriends = faUserGroup;
  readonly searchTerm = signal("");
  readonly profiles = signal<Profile[]>([]);
  readonly hasSearched = signal(false);
  readonly hasResults = computed(() => this.profiles().length > 0);

  constructor(
    private profileService: ProfileService,
    private router: Router,
  ) {}

  searchProfiles(): void {
    this.hasSearched.set(true);
    this.profiles.set([]);

    this.profileService.searchProfiles(this.searchTerm()).subscribe((data) => {
      this.profiles.set(data);
    });
  }

  close(): void {
    this.closed.emit();
  }

  getPostsCount(profile: Profile): number {
    return profile.moments?.length ?? 0;
  }

  getFriendsCount(profile: Profile): number {
    return profile.friends?.length ?? 0;
  }

  openProfile(profile: Profile): void {
    if (!profile?.userId) {
      return;
    }

    this.close();
    void this.router.navigate(["/profile", profile.userId]);
  }
}
