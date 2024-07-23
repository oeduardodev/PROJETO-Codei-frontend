import { Component } from '@angular/core';

import { MomentService } from '../../../services/moment.service';
import { environment } from '../../../environment/environments';
import { Moment } from '../../../Moments';

import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import { AsideProfileComponent } from '../../aside-profile/aside-profile.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    AsideProfileComponent,
    FontAwesomeModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  faSearch = faSearch;
  searchTeam: string = "";

  allMoments: Moment[] = [];
  moments: Moment[] = [];

  baseApiUrl = environment.baseApiUrl;
  constructor(
    private momentService: MomentService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchService.getFilteredMoments().subscribe(moments => {
      this.moments = moments;
    });
    this.momentService.getMoments().subscribe((items) => {
      const data = items.data;

      data.map((item) => {
        item.created_at = new Date(item.created_at!).toLocaleDateString('pt-BR');
      });
      this.allMoments = data;
      this.moments = data;
    });
  }

  search(e: Event): void {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    this.moments = this.allMoments.filter(moment => {
      return moment.title.toLocaleLowerCase().includes(value);
    });
  }
}
