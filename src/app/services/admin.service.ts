import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface DashboardStats {
  totalUsers: number;
  totalTeachers: number;
  pendingTeachers: number;
  approvedTeachers: number;
  rejectedTeachers: number;
}

export interface TeacherListItem {
  id: number;
  nom: string;
  matiere: string;
  ville: string;
  statut: string;
  user: {
    id: number;
    email: string;
    fullName: string;
  };
  createdAt: string;
}

export interface UserListItem {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api/admin';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  getDashboard(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`, {
      headers: this.getHeaders()
    });
  }

  getTeachers(statut?: string, page: number = 1, limit: number = 20): Observable<{
    data: TeacherListItem[];
    total: number;
    page: number;
    limit: number;
  }> {
    let url = `${this.apiUrl}/teachers?page=${page}&limit=${limit}`;
    if (statut) {
      url += `&statut=${statut}`;
    }
    return this.http.get<{
      data: TeacherListItem[];
      total: number;
      page: number;
      limit: number;
    }>(url, { headers: this.getHeaders() });
  }

  approveTeacher(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/teachers/${id}/approve`,
      {},
      { headers: this.getHeaders() }
    );
  }

  rejectTeacher(id: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/teachers/${id}/reject`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteTeacher(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/teachers/${id}`,
      { headers: this.getHeaders() }
    );
  }

  getUsers(page: number = 1, limit: number = 20): Observable<{
    data: UserListItem[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.http.get<{
      data: UserListItem[];
      total: number;
      page: number;
      limit: number;
    }>(`${this.apiUrl}/users?page=${page}&limit=${limit}`, {
      headers: this.getHeaders()
    });
  }
}

