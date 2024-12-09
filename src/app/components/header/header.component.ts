import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { Moment } from '../../models/Moments';
import { faFlaskVial, faHouse, faSearch, faUser, faBars, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import { MomentService } from '../../services/moment.service';
import { environment } from '../../environment/environments';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchService } from '../../services/search.service';
import { UsersService } from '../../services/users.service';
import { AuthorizationService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faSearch = faSearch;
  faHouse = faHouse;
  faFlaskVial = faFlaskVial;
  faUser = faUser;
  faBars = faBars;
  faShare = faShareFromSquare;
  allMoments: Moment[] = [];
  userLogged: boolean = false;
  baseApiUrl = environment.endpoint;
  currentRoute: string = '';

  constructor(
    private momentService: MomentService,
    private searchService: SearchService,
    private authService: AuthorizationService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUser();

    this.momentService.getMoments().subscribe((items) => {
      const data = items.data;

      data.map((item) => {
        item.created_at = new Date(item.created_at!).toLocaleDateString('pt-BR');
      });
      this.allMoments = data;
      this.searchService.setFilteredMoments(data); // Set initial moments
    });

    // Atualize a rota ativa sempre que houver mudanças na navegação
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  search(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    const filteredMoments = this.allMoments.filter(moment =>
      moment.title.toLowerCase().includes(value)
    );
    this.searchService.setSearchTerm(value);
    this.searchService.setFilteredMoments(filteredMoments);
  }

  getUser(): void {
    const headers = this.authService.getAuthorizationHeaders(); // Obtenha os cabeçalhos com o token

    this.userService.getUser(headers).subscribe(
      () => {
        this.userLogged = true;
      },
      () => {
        this.userLogged = false;
      }
    );
  }
}
