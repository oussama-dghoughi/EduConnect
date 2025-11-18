import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Teacher } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: number[] = [];
  private favoritesSubject = new BehaviorSubject<number[]>([]);

  constructor() {
    // Charger depuis localStorage si disponible
    const saved = localStorage.getItem('favorites');
    if (saved) {
      this.favorites = JSON.parse(saved);
      this.favoritesSubject.next(this.favorites);
    }
  }

  getFavorites(): Observable<number[]> {
    return this.favoritesSubject.asObservable();
  }

  isFavorite(teacherId: number): boolean {
    return this.favorites.includes(teacherId);
  }

  addFavorite(teacherId: number): void {
    if (!this.favorites.includes(teacherId)) {
      this.favorites.push(teacherId);
      this.saveToLocalStorage();
      this.favoritesSubject.next(this.favorites);
    }
  }

  removeFavorite(teacherId: number): void {
    this.favorites = this.favorites.filter(id => id !== teacherId);
    this.saveToLocalStorage();
    this.favoritesSubject.next(this.favorites);
  }

  toggleFavorite(teacherId: number): void {
    if (this.isFavorite(teacherId)) {
      this.removeFavorite(teacherId);
    } else {
      this.addFavorite(teacherId);
    }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }
}

