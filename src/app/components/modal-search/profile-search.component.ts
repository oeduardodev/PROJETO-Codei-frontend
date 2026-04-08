import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Router } from "@angular/router";
import {
  faShareFromSquare,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { Profile } from "../../models/Profiles";
import { ProfileService } from "../../services/profile.service";
import { ImageFallbackDirective } from "../../directives/image-fallback.directive";

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
  @Output() closeModal = new EventEmitter<void>();

  faShare = faShareFromSquare;
  faFriends = faUserGroup;
  searchTerm: string = "";
  profiles: Profile[] = [];
  hasSearched = false;
  constructor(
    private profileService: ProfileService,
    private router: Router
  ) {}

  searchProfiles() {
    this.hasSearched = true;
    this.profiles = [];
    this.profileService.searchProfiles(this.searchTerm).subscribe((data) => {
      this.profiles = data;
    });
  }

  close() {
    this.closeModal.emit();
  }

  getPostsCount(profile: Profile): number {
    return profile.moments?.length ?? 0;
  }

  getFriendsCount(profile: Profile): number {
    return profile.friends?.length ?? 0;
  }

  openProfile(profile: Profile) {
    if (!profile?.userId) {
      console.error("Profile without valid userId:", profile);
      return;
    }

    this.close();
    this.router.navigate(["/profile", profile.userId]);
    console.log("Navigating to profile with ID:", profile.userId);
  }
}
