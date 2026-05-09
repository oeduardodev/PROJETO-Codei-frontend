import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  private readonly menuOpenState = signal(false);
  readonly menuOpen = this.menuOpenState.asReadonly();

  toggleMenu(): void {
    this.menuOpenState.update((isOpen) => !isOpen);
  }

  closeMenu(): void {
    this.menuOpenState.set(false);
  }

  openMenu(): void {
    this.menuOpenState.set(true);
  }

  isMenuOpen(): boolean {
    return this.menuOpenState();
  }
}
