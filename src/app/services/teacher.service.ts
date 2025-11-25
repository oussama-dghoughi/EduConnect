import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Teacher, FilterOptions, SortOption } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:8000/api/teachers';

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<{data: any[]}>(this.apiUrl).pipe(
      map(response => this.mapBackendToTeacher(response.data)),
      catchError(error => {
        console.error('Error fetching teachers:', error);
        return of([]);
      })
    );
  }

  getTeacherById(id: number): Observable<Teacher | undefined> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(teacher => this.mapBackendToTeacherSingle(teacher)),
      catchError(error => {
        console.error('Error fetching teacher:', error);
        return of(undefined);
      })
    );
  }

  searchTeachers(query: string, filters: FilterOptions, sortOption: SortOption): Observable<Teacher[]> {
    let params = new HttpParams();
    
    if (filters.matiere) {
      params = params.set('matiere', filters.matiere);
    }
    if (filters.ville) {
      params = params.set('ville', filters.ville);
    }
    if (filters.coursEnLigne !== undefined) {
      params = params.set('coursEnLigne', filters.coursEnLigne.toString());
    }

    return this.http.get<{data: any[]}>(this.apiUrl, { params }).pipe(
      map(response => {
        let teachers = this.mapBackendToTeacher(response.data);
        
        // Recherche textuelle côté client (le backend peut être amélioré plus tard)
        if (query) {
          const lowerQuery = query.toLowerCase();
          teachers = teachers.filter(teacher =>
            teacher.nom.toLowerCase().includes(lowerQuery) ||
            teacher.matiere.toLowerCase().includes(lowerQuery) ||
            teacher.ville.toLowerCase().includes(lowerQuery) ||
            teacher.descriptionCourte?.toLowerCase().includes(lowerQuery)
          );
        }

        // Filtres prix côté client
        if (filters.prixMin !== undefined) {
          teachers = teachers.filter(t => t.prixParHeure >= filters.prixMin!);
        }
        if (filters.prixMax !== undefined) {
          teachers = teachers.filter(t => t.prixParHeure <= filters.prixMax!);
        }
        if (filters.niveauEnseigne) {
          teachers = teachers.filter(t => t.niveauEnseigne.includes(filters.niveauEnseigne!));
        }

        // Tri
        switch (sortOption) {
          case 'prix-croissant':
            teachers.sort((a, b) => a.prixParHeure - b.prixParHeure);
            break;
          case 'prix-decroissant':
            teachers.sort((a, b) => b.prixParHeure - a.prixParHeure);
            break;
          case 'note':
            teachers.sort((a, b) => (b.noteMoyenne || 0) - (a.noteMoyenne || 0));
            break;
          case 'experience':
            teachers.sort((a, b) => b.anneesExperience - a.anneesExperience);
            break;
        }

        return teachers;
      }),
      catchError(error => {
        console.error('Error searching teachers:', error);
        return of([]);
      })
    );
  }

  getMatières(): Observable<string[]> {
    return this.getTeachers().pipe(
      map(teachers => [...new Set(teachers.map(t => t.matiere))].sort())
    );
  }

  getVilles(): Observable<string[]> {
    return this.getTeachers().pipe(
      map(teachers => [...new Set(teachers.map(t => t.ville))].sort())
    );
  }

  private mapBackendToTeacher(backendTeachers: any[]): Teacher[] {
    return backendTeachers.map(bt => this.mapBackendToTeacherSingle(bt));
  }

  private mapBackendToTeacherSingle(backendTeacher: any): Teacher {
    // Valeurs par défaut pour les champs qui n'existent pas encore dans le backend
    return {
      id: backendTeacher.id,
      nom: backendTeacher.nom,
      matiere: backendTeacher.matiere,
      niveauEnseigne: backendTeacher.niveauEnseigne,
      prixParHeure: typeof backendTeacher.prixParHeure === 'string' 
        ? parseFloat(backendTeacher.prixParHeure) 
        : backendTeacher.prixParHeure,
      ville: backendTeacher.ville,
      coursEnLigne: backendTeacher.coursEnLigne || false,
      anneesExperience: backendTeacher.anneesExperience || 0,
      noteMoyenne: backendTeacher.noteMoyenne || 4.5, // Valeur par défaut
      disponibilite: backendTeacher.disponibilite || '',
      descriptionCourte: backendTeacher.descriptionCourte || '',
      descriptionComplete: backendTeacher.descriptionComplete || '',
      diplomes: backendTeacher.diplomes || [],
      photo: backendTeacher.photo || 'https://i.pravatar.cc/150',
      avis: backendTeacher.avis || [] // Pour l'instant vide, à implémenter plus tard
    };
  }
}
