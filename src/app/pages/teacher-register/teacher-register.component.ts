import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-teacher-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './teacher-register.component.html',
  styleUrl: './teacher-register.component.css'
})
export class TeacherRegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  matieres = [
    'Maths', 'Anglais', 'Informatique', 'Physique-Chimie', 'SVT',
    'Économie', 'Français', 'Histoire-Géographie', 'Espagnol', 'Allemand', 'Philosophie'
  ];

  niveaux = [
    'Primaire',
    'Collège',
    'Lycée',
    'Supérieur',
    'Primaire, Collège',
    'Collège, Lycée',
    'Tous niveaux'
  ];

  disponibilites = [
    'Lundi - Vendredi (9h-18h)',
    'Lundi - Vendredi (18h-21h)',
    'Week-end uniquement',
    'Tous les jours',
    'Sur rendez-vous',
    'Flexible'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      // Informations de compte
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [this.phoneValidator]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      // Informations professeur
      nom: ['', [Validators.required, Validators.minLength(3)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      matiere: ['', Validators.required],
      niveauEnseigne: ['', Validators.required],
      prixParHeure: ['', [Validators.required, Validators.min(1)]],
      ville: ['', Validators.required],
      coursEnLigne: [false],
      coursADomicile: [false],
      anneesExperience: [0, [Validators.required, Validators.min(0)]],
      disponibilite: ['', Validators.required],
      descriptionCourte: ['', [Validators.required, Validators.minLength(20)]],
      descriptionComplete: [''],
      diplomes: [''],
      photo: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  phoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
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
      this.successMessage = '';

      const formValue = { ...this.registerForm.value };
      delete formValue.confirmPassword;
      
      // Ne pas envoyer phone si vide
      if (!formValue.phone || formValue.phone.trim() === '') {
        delete formValue.phone;
      }

      // Construire le nom complet à partir de nom et prénom
      if (formValue.prenom && formValue.nom) {
        formValue.nom = `${formValue.prenom} ${formValue.nom}`;
      }
      delete formValue.prenom;

      // Convertir diplomes en tableau
      if (formValue.diplomes) {
        formValue.diplomes = formValue.diplomes.split('\n').filter((d: string) => d.trim());
      }

      // Gérer la disponibilité (pour l'instant on l'envoie tel quel, on pourra l'ajouter à l'entité plus tard)
      // Pour l'instant, on l'ajoute dans descriptionComplete si nécessaire
      if (formValue.disponibilite && !formValue.descriptionComplete) {
        formValue.descriptionComplete = `Disponibilité: ${formValue.disponibilite}`;
      } else if (formValue.disponibilite && formValue.descriptionComplete) {
        formValue.descriptionComplete = `Disponibilité: ${formValue.disponibilite}\n\n${formValue.descriptionComplete}`;
      }

      // Debug: afficher les données envoyées
      console.log('Données envoyées au backend:', formValue);

      // Appel à l'endpoint d'inscription professeur
      this.http.post('http://localhost:8000/api/auth/register-teacher', formValue, {
        headers: { 'Content-Type': 'application/json' }
      }).pipe(
        catchError((error: any) => {
          this.isLoading = false;
          if (error.error) {
            if (error.error.errors && Array.isArray(error.error.errors)) {
              this.errorMessage = error.error.errors.join('. ');
            } else if (error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
            }
          } else {
            this.errorMessage = 'Erreur de connexion au serveur.';
          }
          return throwError(() => error);
        })
      ).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          // Sauvegarder le token et l'utilisateur via le service
          if (response.token && response.user) {
            localStorage.setItem('educonnect_token', response.token);
            localStorage.setItem('educonnect_user', JSON.stringify(response.user));
            // Mettre à jour l'état d'authentification
            (this.authService as any).isAuthenticatedSubject.next(true);
          }
          this.successMessage = 'Compte professeur créé avec succès ! En attente de validation par un administrateur.';
          setTimeout(() => {
            this.router.navigate(['/professeur/profil']);
          }, 2000);
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

  get f() {
    return this.registerForm.controls;
  }
}
