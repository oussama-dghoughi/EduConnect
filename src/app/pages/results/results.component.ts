import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { Teacher, FilterOptions, SortOption } from '../../models/teacher.model';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {
  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  
  searchQuery: string = '';
  filters: FilterOptions = {};
  sortOption: SortOption = 'note';
  
  matieres: string[] = [];
  villes: string[] = [];
  niveaux = ['Primaire', 'Collège', 'Lycée', 'Université'];
  
  prixMin: number = 10;
  prixMax: number = 60;
  prixMinValue: number = 10;
  prixMaxValue: number = 60;

  constructor(
    private teacherService: TeacherService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Charger les matières et villes
    this.teacherService.getMatières().subscribe(matieres => this.matieres = matieres);
    this.teacherService.getVilles().subscribe(villes => this.villes = villes);

    // Récupérer les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.filters.matiere = params['matiere'] || '';
      this.filters.ville = params['ville'] || '';
      this.search();
    });
    
    // Charger tous les professeurs au démarrage si pas de paramètres
    if (!this.searchQuery && !this.filters.matiere && !this.filters.ville) {
      this.search();
    }
  }

  search() {
    this.teacherService.searchTeachers(this.searchQuery, this.filters, this.sortOption)
      .subscribe(teachers => {
        this.teachers = teachers;
        this.applyPriceFilter();
      });
  }

  applyPriceFilter() {
    this.filteredTeachers = this.teachers.filter(t => 
      t.prixParHeure >= this.prixMinValue && t.prixParHeure <= this.prixMaxValue
    );
  }

  onFilterChange() {
    this.search();
  }

  onSortChange() {
    this.search();
  }

  onPriceChange() {
    this.applyPriceFilter();
  }

  resetFilters() {
    this.searchQuery = '';
    this.filters = {};
    this.prixMinValue = this.prixMin;
    this.prixMaxValue = this.prixMax;
    this.sortOption = 'note';
    this.router.navigate(['/professeurs']);
    this.search();
  }

  getStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }
    if (hasHalfStar) {
      stars.push('half');
    }
    while (stars.length < 5) {
      stars.push('empty');
    }
    return stars;
  }
}

