import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  private isWishlistPanelOpen = new BehaviorSubject<boolean>(false);
  isWishlistPanelOpen$ = this.isWishlistPanelOpen.asObservable();

  // --- ADD THESE NEW PROPERTIES AND METHODS ---
  private isCartPanelOpen = new BehaviorSubject<boolean>(false);
  isCartPanelOpen$ = this.isCartPanelOpen.asObservable();

  constructor() { }

  openWishlistPanel(): void { this.isWishlistPanelOpen.next(true); }
  closeWishlistPanel(): void { this.isWishlistPanelOpen.next(false); }

  openCartPanel(): void { this.isCartPanelOpen.next(true); }
  closeCartPanel(): void { this.isCartPanelOpen.next(false); }
}