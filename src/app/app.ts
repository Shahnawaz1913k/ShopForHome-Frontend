import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { AuthService } from './services/auth';
import { CartService } from './services/cart';
import { Observable } from 'rxjs';
import { WishlistPanelComponent } from './components/wishlist-panel/wishlist-panel';
import { UiService } from './services/ui';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './components/notification/notification';
import { CartComponent } from './components/cart/cart';
//import { CartPanelComponent } from './components/cart-panel/cart-panel;
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent,WishlistPanelComponent,CommonModule, NotificationComponent, CartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isWishlistPanelOpen$: Observable<boolean>;
  isCartPanelOpen$: Observable<boolean>;
  protected readonly title = signal('ShopForHome-Frontend');
  
  constructor(
    private authService: AuthService, 
    private cartService: CartService,
    private uiService: UiService
  ) {
    this.isWishlistPanelOpen$ = this.uiService.isWishlistPanelOpen$;
    this.isCartPanelOpen$ = this.uiService.isCartPanelOpen$;

  }
  

  
}
