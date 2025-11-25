import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProfessorService, TeacherProfile } from '../../../services/professor.service';

@Component({
  selector: 'app-profile-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-view.component.html',
  styleUrl: './profile-view.component.css'
})
export class ProfileViewComponent implements OnInit {
  profile: TeacherProfile | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private professorService: ProfessorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.professorService.getProfile().subscribe({
      next: (profile) => {
        console.log('Profile loaded:', profile);
        this.profile = profile;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.isLoading = false;
        
        if (error.status === 404) {
          // Pas de profil, rediriger vers la création
          this.router.navigate(['/professeur/profil/nouveau']);
        } else if (error.status === 401) {
          // Non authentifié, rediriger vers la connexion
          this.router.navigate(['/professeur/connexion']);
        } else {
          this.errorMessage = error.error?.message || 'Erreur lors du chargement du profil';
        }
      }
    });
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'statut-pending',
      'approved': 'statut-approved',
      'rejected': 'statut-rejected'
    };
    return classes[statut] || '';
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'En attente de validation',
      'approved': 'Profil approuvé',
      'rejected': 'Profil rejeté'
    };
    return labels[statut] || statut;
  }

  getDisponibilite(): string {
    if (!this.profile?.descriptionComplete) {
      return '';
    }
    const match = this.profile.descriptionComplete.match(/Disponibilité:\s*(.+?)(?:\n\n|$)/);
    return match ? match[1].trim() : '';
  }
}
