import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchQuery: string = '';
  selectedMatiere: string = '';

  matieres = ['Maths', 'Anglais', 'Informatique', 'Physique-Chimie', 'SVT', 'Économie', 'Français', 'Histoire-Géographie', 'Espagnol', 'Allemand', 'Philosophie'];

  constructor(public router: Router) {}

  onSearch() {
    const query = this.searchQuery.trim();
    const matiere = this.selectedMatiere;
    
    const params: any = {};
    if (query) params.q = query;
    if (matiere) params.matiere = matiere;

    this.router.navigate(['/professeurs'], { queryParams: params });
  }

  selectCategory(matiere: string) {
    this.router.navigate(['/professeurs'], { queryParams: { matiere } });
  }
}

