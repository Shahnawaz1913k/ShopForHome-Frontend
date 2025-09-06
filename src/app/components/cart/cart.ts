import { Component, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { RouterModule } from '@angular/router';
import { UiService } from '../../services/ui'; // <-- Import UiService

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  cartItems;
  cartTotal: Signal<number>;

  constructor(
    private cartService: CartService,
    private uiService: UiService // <-- Inject UiService
  ) {
    this.cartItems = this.cartService.items;
    this.cartTotal = computed(() => 
      this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
    );
  }

  // Method to close the panel
  closePanel(): void {
    this.uiService.closeCartPanel();
  }

  increaseQuantity(item: any): void { this.cartService.updateQuantity(item.productId, item.quantity + 1); }
  decreaseQuantity(item: any): void { this.cartService.updateQuantity(item.productId, item.quantity - 1); }
  removeItem(item: any): void { this.cartService.removeFromCart(item.productId); }
}