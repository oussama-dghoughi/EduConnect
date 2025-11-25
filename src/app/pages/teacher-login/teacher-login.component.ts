import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-teacher-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './teacher-login.component.html',
  styleUrl: './teacher-login.component.css'
})
export class TeacherLoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login response:', response);
          console.log('User roles:', response.user.roles);
          
          // Vérifier si l'utilisateur est un professeur
          const roles = response.user.roles;
          let isTeacher = false;
          
          if (roles) {
            if (Array.isArray(roles)) {
              isTeacher = roles.includes('ROLE_TEACHER');
            } else {
              // Convertir en string et vérifier
              const rolesStr = String(roles);
              isTeacher = rolesStr.indexOf('ROLE_TEACHER') !== -1;
            }
          }
          
          console.log('Is teacher check:', isTeacher);
          console.log('Roles array:', roles);
          
          if (isTeacher) {
            console.log('User is a teacher, redirecting to professor profile');
            // Attendre que le token soit bien sauvegardé dans handleAuthResponse
            setTimeout(() => {
              // Vérifier que le token et l'utilisateur sont bien sauvegardés
              const token = localStorage.getItem('educonnect_token');
              const savedUser = JSON.parse(localStorage.getItem('educonnect_user') || '{}');
              console.log('Token saved:', !!token);
              console.log('User saved:', savedUser);
              console.log('Saved user roles:', savedUser?.roles);
              
              if (token && savedUser) {
                console.log('Redirecting to /professeur/profil using window.location');
                // Utiliser window.location.href pour forcer un rechargement complet
                // Cela garantit que le guard verra bien le token et les rôles
                window.location.href = '/professeur/profil';
              } else {
                console.error('Token or user not saved properly, retrying...');
                setTimeout(() => {
                  window.location.href = '/professeur/profil';
                }, 300);
              }
            }, 300);
          } else {
            console.log('Not a teacher, roles:', roles);
            console.log('Redirecting to home');
            this.router.navigate(['/']);
          }
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          if (error.errorMessage) {
            this.errorMessage = error.errorMessage;
          } else if (error.error) {
            if (error.error.errors && Array.isArray(error.error.errors)) {
              this.errorMessage = error.error.errors.join('. ');
            } else if (error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
            }
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Erreur de connexion au serveur. Vérifiez que le backend est démarré sur http://localhost:8000';
          }
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
