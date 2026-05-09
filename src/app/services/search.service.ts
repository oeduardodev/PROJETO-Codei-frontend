import { Injectable, signal } from '@angular/core';
import { Moment } from '../models/Moments';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly searchTermState = signal('');
  private readonly filteredMomentsState = signal<Moment[]>([]);

  readonly searchTerm = this.searchTermState.asReadonly();
  readonly filteredMoments = this.filteredMomentsState.asReadonly();

  setSearchTerm(term: string) {
    this.searchTermState.set(term);
  }

  setFilteredMoments(moments: Moment[]) {
    this.filteredMomentsState.set(moments);
  }
}
