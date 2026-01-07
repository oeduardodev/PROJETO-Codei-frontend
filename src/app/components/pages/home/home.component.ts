import { Component, OnInit } from "@angular/core";

import { MomentService } from "../../../services/moment.service";
import { environment } from "../../../environment/environments";
import { Moment } from "../../../models/Moments";

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SearchService } from "../../../services/search.service";
import { AsideProfileComponent } from "../../aside-profile/aside-profile.component";
import { NgxTypedJsModule } from "ngx-typed-js";
import { AsideFriendsComponent } from "../../aside-friends/aside-friends.component";
import { UsersService } from "../../../services/users.service";
import { AuthorizationService } from "../../../services/auth.service";
import { ProfileService } from "../../../services/profile.service";
import { Chat } from "../../../models/Chat";
import { Profile } from "../../../models/Profiles";
import { ChatService } from "../../../services/chat.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    AsideFriendsComponent,
    AsideProfileComponent,
    FontAwesomeModule,
    CommonModule,
    RouterLink,
    NgxTypedJsModule,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  faSearch = faSearch;
  searchTeam = "";

  allMoments: Moment[] = [];
  moments: Moment[] = [];

  endpoint = environment.endpoint;
  constructor(
    private momentService: MomentService,
    private searchService: SearchService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.userService.getUser();
    this.searchService.getFilteredMoments().subscribe((moments) => {
      this.moments = moments;
    });
    this.momentService.getMoments().subscribe((items) => {
      const data = items.data;

      data.map((item) => {
        item.created_at = new Date(item.created_at!).toLocaleDateString(
          "pt-BR"
        );
      });
      this.allMoments = data;
      this.moments = data;
    });
  }

  search(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    this.moments = this.allMoments.filter((moment) => {
      return moment.title.toLocaleLowerCase().includes(value);
    });
  }
}
