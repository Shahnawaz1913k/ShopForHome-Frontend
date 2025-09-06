import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.css']
})
export class ProductManagementComponent implements OnInit {
  // Convert all state properties to signals
  products = signal<any[]>([]);
  categories = signal<any[]>([]);
  
  isProductModalOpen = signal(false);
  isEditMode = signal(false);
  currentProduct = signal<any>({});

  isCategoryModalOpen = signal(false);
  newCategoryName = signal('');

  selectedFile = signal<File | null>(null);
  bulkUploadCategoryId = signal<number | null>(null);

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void { this.adminService.getProducts().subscribe(data => this.products.set(data)); }
  loadCategories(): void { this.adminService.getCategories().subscribe(data => this.categories.set(data)); }

  // --- Product Modal Methods ---
  openAddModal(): void {
    this.isEditMode.set(false);
    this.currentProduct.set({ categoryId: this.categories()[0]?.id || '' });
    this.isProductModalOpen.set(true);
  }
  openEditModal(product: any): void {
    this.isEditMode.set(true);
    this.currentProduct.set({ ...product });
    this.isProductModalOpen.set(true);
  }
  closeProductModal(): void { this.isProductModalOpen.set(false); }
  saveProduct(): void {
    const operation = this.isEditMode()
      ? this.adminService.updateProduct(this.currentProduct())
      : this.adminService.addProduct(this.currentProduct());
    operation.subscribe(() => {
      this.loadProducts();
      this.closeProductModal();
    });
  }
  deleteProduct(id: number): void {
    if (confirm('Are you sure?')) {
      this.adminService.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  // --- Category Modal Methods ---
  openCategoryModal(): void { this.loadCategories(); this.isCategoryModalOpen.set(true); }
  closeCategoryModal(): void { this.isCategoryModalOpen.set(false); }
  onAddCategory(): void {
    if (!this.newCategoryName().trim()) return;
    this.adminService.addCategory({ name: this.newCategoryName() }).subscribe(() => {
      this.newCategoryName.set('');
      this.loadCategories();
    });
  }
  onDeleteCategory(id: number): void {
    if (confirm('Are you sure?')) {
      this.adminService.deleteCategory(id).subscribe({
        next: () => this.loadCategories(),
        error: (err:any) => alert(err.error)
      });
    }
  }

  // --- Bulk Upload Methods ---
  onFileSelected(event: any): void {
    this.selectedFile.set(event.target.files[0] || null);
  }
  onUpload(): void {
    if (this.selectedFile() && this.bulkUploadCategoryId()) {
      this.adminService.bulkUploadProducts(this.selectedFile()!, this.bulkUploadCategoryId()!).subscribe({
        next: (response:any) => {
          alert(response.message);
          this.loadProducts();
        },
        error: (err:any) => alert('Upload failed. Check console for details.')
      });
    } else {
      alert('Please select a category and a CSV file.');
    }
  }
  
  // Helper methods for ngModel with signals
  updateCurrentProduct(property: string, value: any): void {
    this.currentProduct.update(p => ({ ...p, [property]: value }));
  }
}