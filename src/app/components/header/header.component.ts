import { CommonModule } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  faArrowLeft,
  faBars,
  faHouse,
  faRightFromBracket,
  faSearch,
  faShareFromSquare,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter } from "rxjs";
import { Moment } from "../../models/Moments";
import { AuthorizationService } from "../../services/auth.service";
import { MenuService } from "../../services/menu.service";
import { MomentService } from "../../services/moment.service";
import { SearchService } from "../../services/search.service";
import { UsersService } from "../../services/users.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  readonly faSearch = faSearch;
  readonly faHouse = faHouse;
  readonly faUser = faUser;
  readonly faBars = faBars;
  readonly faShare = faShareFromSquare;
  readonly faLogout = faRightFromBracket;
  readonly faArrowLeft = faArrowLeft;

  readonly menuOpen = this.menuService.menuOpen;
  readonly userLogged = signal(false);
  readonly userName = signal("");
  readonly currentRoute = signal("");
  readonly allMoments = signal<Moment[]>([]);

  readonly isMomentEditorRoute = computed(
    () => this.currentRoute() === "/moments/new",
  );
  readonly showProfileShortcut = computed(() => {
    const route = this.currentRoute();
    return route === "/" || route === "/moments/new";
  });
  readonly showHomeShortcut = computed(() => {
    const route = this.currentRoute();
    return route === "/profile" || route === "/login" || route === "/moments/new";
  });

  constructor(
    private momentService: MomentService,
    private searchService: SearchService,
    private authService: AuthorizationService,
    private userService: UsersService,
    private router: Router,
    private menuService: MenuService,
  ) {
    this.currentRoute.set(this.router.url);
    this.checkUserAuthentication();
    this.loadMoments();
    this.setupRouterListener();
  }

  private checkUserAuthentication(): void {
    const token = localStorage.getItem("authToken");

    if (!token || !this.authService.isAuthenticated()) {
      this.resetUserState();
      return;
    }

    this.userService.getUser().subscribe({
      next: (user) => {
        this.userLogged.set(true);
        this.userName.set(user.username || "");
      },
      error: (error) => {
        if (error.status === 401) {
          this.handleUnauthorized();
          return;
        }

        this.resetUserState();
      },
    });
  }

  loadMoments(): void {
    this.momentService.getMoments().subscribe({
      next: (items) => {
        const data = items.data.map((item) => ({
          ...item,
          created_at: new Date(item.created_at!).toLocaleDateString("pt-BR"),
        }));

        this.allMoments.set(data);
        this.searchService.setFilteredMoments(data);
      },
      error: (error) => {
        if (error.status === 401) {
          this.handleUnauthorized();
        }
      },
    });
  }

  private setupRouterListener(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute.set(event.urlAfterRedirects);
        this.menuService.closeMenu();

        if (
          event.urlAfterRedirects === "/login" ||
          event.urlAfterRedirects === "/register"
        ) {
          this.resetUserState();
          return;
        }

        if (this.authService.isAuthenticated() && !this.userLogged()) {
          this.checkUserAuthentication();
        }
      });
  }

  search(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    const filteredMoments = this.allMoments().filter((moment) =>
      moment.title.toLowerCase().includes(value),
    );

    this.searchService.setSearchTerm(value);
    this.searchService.setFilteredMoments(filteredMoments);
  }

  logout(): void {
    this.authService.clearToken();
    this.resetUserState();
    void this.router.navigate(["/login"]);
  }

  private handleUnauthorized(): void {
    this.authService.clearToken();
    this.resetUserState();

    if (!this.currentRoute().includes("login")) {
      void this.router.navigate(["/login"]);
    }
  }

  private resetUserState(): void {
    this.userLogged.set(false);
    this.userName.set("");
  }

  toggleMenu(): void {
    this.menuService.toggleMenu();
  }

  closeMenu(): void {
    this.menuService.closeMenu();
  }
}
