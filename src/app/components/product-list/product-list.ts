import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';
import { WishlistService } from '../../services/wishlist';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  selectedCategory = signal<string>('');

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    //private cdr: ChangeDetectorRef
  ) { 
    //console.log('ProductListComponent is using CartService:', this.cartService);
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (data: any) => {
        this.categories.set(data);
      },
      // This will log an error to the console if the API call fails
      error: (err: any) => console.error('Failed to load categories:', err)
    });
  }

  getProductImageUrl(product: any): string {
    // We are temporarily using a different image provider (Lorem Picsum) for this test.
    // It uses the product ID as a "seed" to get a unique image for each product.
    return `https://picsum.photos/seed/${product.id}/300/300`;
  }
  loadProducts(): void {
    this.productService.getProducts(this.selectedCategory()).subscribe({
      next: (data: any) => {
        this.products.set(data);
      },
      // This will log an error to the console if the API call fails
      error: (err: any) => console.error('Failed to load products:', err)
    });
  }

  filterByCategory(categoryName: string): void {
    this.selectedCategory.set(categoryName);
    this.loadProducts();
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);

  }
  addToWishlist(product: any): void {
    this.wishlistService.addToWishlist(product);
  }
}