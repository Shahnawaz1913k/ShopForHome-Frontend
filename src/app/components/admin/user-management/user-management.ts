import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UserManagementComponent implements OnInit {
  // Convert component state properties to signals
  users = signal<any[]>([]);
  isModalOpen = signal(false);
  isEditMode = signal(false);
  currentUser = signal<any>({});

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.adminService.getUsers().subscribe(data => {
      this.users.set(data); // Use .set() to update the signal's value
    });
  }

  openAddModal(): void {
    this.isEditMode.set(false);
    this.currentUser.set({ role: 'User' }); // Default values for a new user
    this.isModalOpen.set(true);
  }

  openEditModal(user: any): void {
    this.isEditMode.set(true);
    // Create a copy to avoid modifying the list directly
    this.currentUser.set({ ...user, password: '' }); // Clear password for security
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  saveUser(): void {
    // Read the signal's value by calling it as a function: isEditMode() and currentUser()
    const operation = this.isEditMode()
      ? this.adminService.updateUser(this.currentUser())
      : this.adminService.addUser(this.currentUser());
      
    operation.subscribe(() => this.onSaveSuccess());
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

  // Helper method to update a property on the currentUser signal
  // This is needed for two-way binding in the template
  updateCurrentUser(property: string, value: any): void {
    this.currentUser.update(user => ({ ...user, [property]: value }));
  }
}