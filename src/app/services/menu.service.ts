import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  private menuOpenSubject = new BehaviorSubject<boolean>(false);
  public menuOpen$: Observable<boolean> = this.menuOpenSubject.asObservable();

  constructor() {}

  toggleMenu(): void {
    this.menuOpenSubject.next(!this.menuOpenSubject.value);
  }

  closeMenu(): void {
    this.menuOpenSubject.next(false);
  }

  openMenu(): void {
    this.menuOpenSubject.next(true);
  }

  isMenuOpen(): boolean {
    return this.menuOpenSubject.value;
  }
}
