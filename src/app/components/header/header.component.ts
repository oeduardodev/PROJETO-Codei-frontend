import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Moment } from '../../Moments';
import { faFlaskVial, faHouse, faSearch, faUser } from '@fortawesome/free-solid-svg-icons';
import { MomentService } from '../../services/moment.service';
import { environment } from '../../environment/environments';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchService } from '../../services/search.service';

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
  faUser = faUser
  allMoments: Moment[] = [];

  baseApiUrl = environment.endpoint;

  constructor(private momentService: MomentService, private searchService: SearchService) {}

  ngOnInit(): void {
    this.momentService.getMoments().subscribe((items) => {
      const data = items.data;

      data.map((item) => {
        item.created_at = new Date(item.created_at!).toLocaleDateString('pt-BR');
      });
      this.allMoments = data;
      this.searchService.setFilteredMoments(data); // Set initial moments
    });
  }

  search(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value.toLowerCase();

    const filteredMoments = this.allMoments.filter(moment => moment.title.toLowerCase().includes(value));
    this.searchService.setSearchTerm(value);
    this.searchService.setFilteredMoments(filteredMoments);
  }
}
