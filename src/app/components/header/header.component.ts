import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd, RouterLink } from "@angular/router";
import { Subscription } from "rxjs";
import { Moment } from "../../models/Moments";
import {
  faFlaskVial,
  faHouse,
  faSearch,
  faUser,
  faBars,
  faShareFromSquare,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { MomentService } from "../../services/moment.service";
import { environment } from "../../environment/environments";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SearchService } from "../../services/search.service";
import { UsersService } from "../../services/users.service";
import { AuthorizationService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit, OnDestroy {
  faSearch = faSearch;
  faHouse = faHouse;
  faFlaskVial = faFlaskVial;
  faUser = faUser;
  faBars = faBars;
  faShare = faShareFromSquare;
  faLogout = faRightFromBracket;

  allMoments: Moment[] = [];
  userLogged = false;
  baseApiUrl = environment.endpoint;
  currentRoute = "";
  userName: string = "";
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private momentService: MomentService,
    private searchService: SearchService,
    private authService: AuthorizationService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkUserAuthentication();
    this.loadMoments();
    this.setupRouterListener();
  }

  ngOnDestroy(): void {
    // Limpa a inscrição para evitar memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkUserAuthentication(): void {
    // Primeiro verifica se há token
    const token = localStorage.getItem("authToken");

    if (token && this.authService.isAuthenticated()) {
      // Se tem token, tenta buscar dados do usuário
      this.userService.getUser().subscribe({
        next: (user) => {
          this.userLogged = true;
          this.userName = user.username || "";
        },
        error: (error) => {
          if (error.status === 401) {
            // Token inválido ou expirado
            this.handleUnauthorized();
          }
          this.userLogged = false;
          this.userName = "";
        },
      });
    } else {
      this.userLogged = false;
      this.userName = "";
    }
  }

  public loadMoments(): void {
    this.momentService.getMoments().subscribe({
      next: (items) => {
        const data = items.data;
        data.map((item) => {
          item.created_at = new Date(item.created_at!).toLocaleDateString(
            "pt-BR"
          );
        });
        this.allMoments = data;
        this.searchService.setFilteredMoments(data);
      },
      error: (error) => {
        console.error("Erro ao carregar momentos:", error);
        if (error.status === 401) {
          this.handleUnauthorized();
        }
      },
    });
  }

  private setupRouterListener(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        // Atualiza o estado de autenticação quando a rota muda
        if (
          event.urlAfterRedirects === "/login" ||
          event.urlAfterRedirects === "/register"
        ) {
          this.userLogged = false;
        } else if (this.authService.isAuthenticated() && !this.userLogged) {
          // Se o usuário está autenticado mas o estado não foi atualizado
          this.checkUserAuthentication();
        }
      }
    });
  }

  search(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    const filteredMoments = this.allMoments.filter((moment) =>
      moment.title.toLowerCase().includes(value)
    );
    this.searchService.setSearchTerm(value);
    this.searchService.setFilteredMoments(filteredMoments);
  }

  logout(): void {
    this.authService.clearToken();
    this.userLogged = false;
    this.userName = "";
    this.router.navigate(["/login"]);
  }

  private handleUnauthorized(): void {
    this.authService.clearToken();
    this.userLogged = false;
    this.userName = "";
    // Se não estiver na página de login, redireciona
    if (!this.currentRoute.includes("login")) {
      this.router.navigate(["/login"]);
    }
  }
}
