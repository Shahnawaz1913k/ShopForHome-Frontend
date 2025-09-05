import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';
import { Observable, map } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent {
  // Expose the observable directly to the template
  cartItems$: Observable<any[]>;
  cartTotal$: Observable<number>;

  constructor(private cartService: CartService) {
    this.cartItems$ = this.cartService.cartItems$;

    // Calculate the total price reactively
    this.cartTotal$ = this.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + (item.price * item.quantity), 0))
    );
  }

  increaseQuantity(item: any): void {
    this.cartService.updateQuantity(item.productId, item.quantity + 1);
  }

  decreaseQuantity(item: any): void {
    this.cartService.updateQuantity(item.productId, item.quantity - 1);
  }

  removeItem(item: any): void {
    this.cartService.removeFromCart(item.productId);
  }
}