import { Component } from "@angular/core";
import { NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { MessagesComponent } from "./components/messages/messages.component";
import { AsideFriendsComponent } from "./components/aside-friends/aside-friends.component";
import { AsideProfileComponent } from "./components/aside-profile/aside-profile.component";
import { NgIf } from "@angular/common";

@Component({
  selector: "app-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
  imports: [
    NgIf,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MessagesComponent,
    AsideFriendsComponent,
    AsideProfileComponent,
  ],
})
export class AppComponent {
  title = "Codei";
  hideAsides = false;

  constructor(private router: Router) {
    this.updateAsidesVisibility(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateAsidesVisibility(event.urlAfterRedirects);
      }
    });
  }

  private updateAsidesVisibility(url: string): void {
    const path = url.split("?")[0].split("#")[0];
    this.hideAsides = /^\/(login|register)(\/|$)/.test(path);
  }
}
