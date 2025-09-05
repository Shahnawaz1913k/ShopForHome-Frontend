import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Import FormsModule for the modal
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Add FormsModule
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  isModalOpen = false;
  isEditMode = false;
  currentUser: any = {};

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.currentUser = { role: 'User' }; // Default values for a new user
    this.isModalOpen = true;
  }

  openEditModal(user: any): void {
    this.isEditMode = true;
    // Create a copy to avoid modifying the list directly
    this.currentUser = { ...user, password: '' }; // Clear password for security
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveUser(): void {
    if (this.isEditMode) {
      // If the password field is empty, don't send it in the update
      const userToUpdate = { ...this.currentUser };
      if (!userToUpdate.password) {
        delete userToUpdate.password;
      }
      this.adminService.updateUser(userToUpdate).subscribe(() => this.onSaveSuccess());
    } else {
      this.adminService.addUser(this.currentUser).subscribe(() => this.onSaveSuccess());
    }
  }

  onSaveSuccess(): void {
    this.loadUsers();
    this.closeModal();
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }
}