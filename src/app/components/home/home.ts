import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  //featuredProducts: any[] = [];
  featuredProducts = signal<any[]>([])

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    // Fetch all products when the component loads
    this.productService.getProducts().subscribe(allProducts => {
      // Use slice(0, 8) to get only the first 8 products for the home page
      this.featuredProducts.set(allProducts.slice(0, 6));
    });
  }

  // Use the picsum.photos service for placeholder images
  getProductImageUrl(product: any): string {
    return `https://picsum.photos/seed/${product.id}/300/300`;
  }

  // Method to add a product to the cart
  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }

  // Method to add a product to the wishlist
  addToWishlist(product: any): void {
    this.wishlistService.addToWishlist(product);
  }
}