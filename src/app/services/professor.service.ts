import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Teacher } from '../models/teacher.model';

export interface TeacherProfile extends Teacher {
  statut: string;
  createdAt: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private apiUrl = 'http://localhost:8000/api/professor';

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

  getProfile(): Observable<TeacherProfile> {
    return this.http.get<TeacherProfile>(`${this.apiUrl}/profile`, {
      headers: this.getHeaders()
    });
  }

  createProfile(data: Partial<Teacher>): Observable<{
    message: string;
    data: TeacherProfile;
  }> {
    return this.http.post<{
      message: string;
      data: TeacherProfile;
    }>(`${this.apiUrl}/profile`, data, {
      headers: this.getHeaders()
    });
  }

  updateProfile(data: Partial<Teacher>): Observable<{
    message: string;
    data: TeacherProfile;
  }> {
    return this.http.put<{
      message: string;
      data: TeacherProfile;
    }>(`${this.apiUrl}/profile`, data, {
      headers: this.getHeaders()
    });
  }
}

