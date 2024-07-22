import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Moment } from '../Moments';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private searchTerm = new BehaviorSubject<string>('');
  private filteredMoments = new BehaviorSubject<Moment[]>([]);

  setSearchTerm(term: string) {
    this.searchTerm.next(term);
  }

  getSearchTerm() {
    return this.searchTerm.asObservable();
  }

  setFilteredMoments(moments: Moment[]) {
    this.filteredMoments.next(moments);
  }

  getFilteredMoments() {
    return this.filteredMoments.asObservable();
  }
}
