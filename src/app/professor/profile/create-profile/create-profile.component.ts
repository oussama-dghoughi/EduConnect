import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfessorService } from '../../../services/professor.service';

@Component({
  selector: 'app-create-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './create-profile.component.html',
  styleUrl: './create-profile.component.css'
})
export class CreateProfileComponent {
  profileForm: FormGroup;
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

  constructor(
    private fb: FormBuilder,
    private professorService: ProfessorService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      matiere: ['', Validators.required],
      niveauEnseigne: ['', Validators.required],
      prixParHeure: ['', [Validators.required, Validators.min(1)]],
      ville: ['', Validators.required],
      coursEnLigne: [false],
      anneesExperience: [0, [Validators.required, Validators.min(0)]],
      descriptionCourte: ['', [Validators.required, Validators.minLength(20)]],
      descriptionComplete: [''],
      diplomes: [''],
      photo: ['']
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = { ...this.profileForm.value };
      
      // Convertir diplomes en tableau
      if (formValue.diplomes) {
        formValue.diplomes = formValue.diplomes.split('\n').filter((d: string) => d.trim());
      }

      this.professorService.createProfile(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Profil créé avec succès ! En attente de validation par un administrateur.';
          setTimeout(() => {
            this.router.navigate(['/professeur/profil']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de la création du profil';
        }
      });
    } else {
      this.markFormGroupTouched(this.profileForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  get f() {
    return this.profileForm.controls;
  }
}
