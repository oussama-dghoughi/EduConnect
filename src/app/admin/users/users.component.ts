import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService, UserListItem } from '../../services/admin.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: UserListItem[] = [];
  isLoading = true;
  errorMessage = '';
  currentPage = 1;
  total = 0;
  limit = 20;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.adminService.getUsers(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.users = response.data;
        this.total = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
      }
    });
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadUsers();
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }
}
