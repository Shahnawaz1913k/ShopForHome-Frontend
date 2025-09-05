// In src/app/components/product-list/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  selectedCategory: string = '';

  constructor(private productService: ProductService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadProducts(): void {
    this.productService.getProducts(this.selectedCategory).subscribe(data => {
      this.products = data;
    });
  }

  filterByCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.loadProducts();
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }
}