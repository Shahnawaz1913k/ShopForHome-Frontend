import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-sales-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sales-reports.html',
  styleUrls: ['./sales-reports.css']
})
export class SalesReportsComponent {
  startDate: string = '';
  endDate: string = '';
  reportData: any = null;

  constructor(private adminService: AdminService) {}

  generateReport(): void {
    if (this.startDate && this.endDate) {
      this.adminService.getSalesReport(this.startDate, this.endDate).subscribe(data => {
        this.reportData = data;
      });
    } else {
      alert('Please select both a start and end date.');
    }
  }
}