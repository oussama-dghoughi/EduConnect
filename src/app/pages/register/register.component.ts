import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [this.phoneValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Phone is optional
    }
    const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;
    return phoneRegex.test(control.value) ? null : { invalidPhone: true };
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = { ...this.registerForm.value };
      delete formValue.confirmPassword;
      
      // Ne pas envoyer phone si vide
      if (!formValue.phone || formValue.phone.trim() === '') {
        delete formValue.phone;
      }

      this.authService.register(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Registration error:', error);
          
          // Utiliser errorMessage si disponible (depuis handleError)
          if (error.errorMessage) {
            this.errorMessage = error.errorMessage;
          } else if (error.error) {
            if (error.error.errors && Array.isArray(error.error.errors)) {
              this.errorMessage = error.error.errors.join('. ');
            } else if (error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
            }
          } else if (error.message) {
            this.errorMessage = error.message;
          } else {
            this.errorMessage = 'Erreur de connexion au serveur. Vérifiez que le backend est démarré sur http://localhost:8000';
          }
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get fullName() {
    return this.registerForm.get('fullName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  get passwordMismatch() {
    return this.registerForm.errors?.['passwordMismatch'] && 
           this.confirmPassword?.touched && 
           this.password?.touched;
  }
}
