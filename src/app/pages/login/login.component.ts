import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
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
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Login error:', error);
          
          // Utiliser errorMessage si disponible (depuis handleError)
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
