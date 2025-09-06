import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-stock-management',
  standalone: true,
  imports: [CommonModule, NgClass],
  templateUrl: './stock-management.html',
  styleUrls: ['./stock-management.css']
})
export class StockManagementComponent implements OnInit {
  products: any[] = [];
  lowStockProducts: any[] = [];
  lowStockThreshold = 10;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
}