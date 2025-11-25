import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfessorService } from '../../../services/professor.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  isLoading = false;
  loadingProfile = true;
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
      coursADomicile: [false],
      anneesExperience: [0, [Validators.required, Validators.min(0)]],
      disponibilite: [''],
      descriptionCourte: ['', [Validators.required, Validators.minLength(20)]],
      descriptionComplete: [''],
      diplomes: [''],
      photo: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.professorService.getProfile().subscribe({
      next: (profile) => {
        // Extraire la disponibilité de la description complète si elle existe
        let disponibilite = '';
        if (profile.descriptionComplete) {
          const match = profile.descriptionComplete.match(/Disponibilité:\s*(.+?)(?:\n\n|$)/);
          if (match) {
            disponibilite = match[1].trim();
          }
        }

        this.profileForm.patchValue({
          nom: profile.nom,
          matiere: profile.matiere,
          niveauEnseigne: profile.niveauEnseigne,
          prixParHeure: profile.prixParHeure,
          ville: profile.ville,
          coursEnLigne: profile.coursEnLigne || false,
          coursADomicile: false, // À définir si on ajoute ce champ à l'entité
          anneesExperience: profile.anneesExperience,
          disponibilite: disponibilite,
          descriptionCourte: profile.descriptionCourte,
          descriptionComplete: profile.descriptionComplete?.replace(/Disponibilité:.*?\n\n?/, '').trim() || '',
          diplomes: profile.diplomes?.join('\n') || '',
          photo: profile.photo || ''
        });
        this.loadingProfile = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Erreur lors du chargement du profil';
        this.loadingProfile = false;
      }
    });
  }

  onSubmit() {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formValue = { ...this.profileForm.value };
      
      if (formValue.diplomes) {
        formValue.diplomes = formValue.diplomes.split('\n').filter((d: string) => d.trim());
      }

      // Ajouter la disponibilité à la description complète
      if (formValue.disponibilite) {
        if (!formValue.descriptionComplete) {
          formValue.descriptionComplete = `Disponibilité: ${formValue.disponibilite}`;
        } else {
          // Remplacer l'ancienne disponibilité si elle existe
          formValue.descriptionComplete = formValue.descriptionComplete.replace(/Disponibilité:.*?\n\n?/, '');
          formValue.descriptionComplete = `Disponibilité: ${formValue.disponibilite}\n\n${formValue.descriptionComplete}`.trim();
        }
      }
      delete formValue.disponibilite;

      this.professorService.updateProfile(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = 'Profil mis à jour avec succès !';
          setTimeout(() => {
            this.router.navigate(['/professeur/profil']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour du profil';
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
