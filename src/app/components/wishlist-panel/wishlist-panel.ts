import { Component, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../services/ui';
import { WishlistService } from '../../services/wishlist';
import { CartService } from '../../services/cart';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wishlist-panel',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './wishlist-panel.html',
  styleUrls: ['./wishlist-panel.css']
})
export class WishlistPanelComponent {
  // Directly reference the readonly signal from the service
  wishlistItems;

  constructor(
    private uiService: UiService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {this.wishlistItems = this.wishlistService.items;}

  closePanel(): void {
    this.uiService.closeWishlistPanel();
  }

  removeItem(productId: number): void {
    this.wishlistService.removeFromWishlist(productId);
  }

  moveToCart(product: any): void {
    this.cartService.addToCart(product);
    this.wishlistService.removeFromWishlist(product.id);
  }
}