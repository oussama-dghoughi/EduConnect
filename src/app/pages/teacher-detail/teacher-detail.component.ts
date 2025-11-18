import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { FavoritesService } from '../../services/favorites.service';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './teacher-detail.component.html',
  styleUrl: './teacher-detail.component.css'
})
export class TeacherDetailComponent implements OnInit {
  teacher: Teacher | undefined;
  isFavorite: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.teacherService.getTeacherById(+id).subscribe(teacher => {
        if (teacher) {
          this.teacher = teacher;
          this.favoritesService.getFavorites().subscribe(favorites => {
            this.isFavorite = favorites.includes(teacher.id);
          });
        } else {
          this.router.navigate(['/professeurs']);
        }
      });
    }
  }

  toggleFavorite() {
    if (this.teacher) {
      this.favoritesService.toggleFavorite(this.teacher.id);
      this.isFavorite = !this.isFavorite;
    }
  }

  contactTeacher() {
    if (this.teacher) {
      alert(`Contactez ${this.teacher.nom} à l'adresse email : ${this.teacher.nom.toLowerCase().replace(' ', '.')}@educonnect.fr`);
    }
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

  getNiveaux(): string[] {
    if (!this.teacher) return [];
    return this.teacher.niveauEnseigne.split(',').map(n => n.trim());
  }
}

