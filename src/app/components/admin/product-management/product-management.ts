import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule for the modal form
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Add FormsModule here
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.css']
})
export class ProductManagementComponent implements OnInit {
  products: any[] = [];
  isModalOpen = false;
  isEditMode = false;
  currentProduct: any = {};

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.adminService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentProduct = { name: '', price: 0, stockQuantity: 0, categoryId: 1 }; // Default values
    this.isModalOpen = true;
  }

  openEditModal(product: any): void {
    this.isEditMode = true;
    this.currentProduct = { ...product }; // Create a copy for editing
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveProduct(): void {
    if (this.isEditMode) {
      this.adminService.updateProduct(this.currentProduct).subscribe(() => this.onSaveSuccess());
    } else {
      this.adminService.addProduct(this.currentProduct).subscribe(() => this.onSaveSuccess());
    }
  }
  
  onSaveSuccess(): void {
    this.loadProducts();
    this.closeModal();
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.adminService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }
}