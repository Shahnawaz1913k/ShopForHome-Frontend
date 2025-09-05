import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-discount-coupons',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './discount-coupons.html',
  styleUrls: ['./discount-coupons.css']
})
export class DiscountCouponsComponent {
  newCoupon = {
    code: '',
    discountAmount: null,
    expirationDate: ''
  };

  constructor(private adminService: AdminService) {}

  createCoupon(): void {
    this.adminService.createCoupon(this.newCoupon).subscribe(response => {
      alert(response.message);
      this.newCoupon = { code: '', discountAmount: null, expirationDate: '' };
    });
  }
}