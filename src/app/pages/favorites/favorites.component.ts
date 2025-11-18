import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { FavoritesService } from '../../services/favorites.service';
import { Teacher } from '../../models/teacher.model';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favoriteTeachers: Teacher[] = [];

  constructor(
    private teacherService: TeacherService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    combineLatest([
      this.favoritesService.getFavorites(),
      this.teacherService.getTeachers()
    ]).pipe(
      map(([favoriteIds, teachers]) => 
        teachers.filter(teacher => favoriteIds.includes(teacher.id))
      )
    ).subscribe(teachers => {
      this.favoriteTeachers = teachers;
    });
  }

  removeFavorite(teacherId: number) {
    this.favoritesService.removeFavorite(teacherId);
    this.loadFavorites();
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

