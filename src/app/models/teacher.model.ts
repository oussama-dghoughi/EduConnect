export interface Teacher {
  id: number;
  nom: string;
  matiere: string;
  niveauEnseigne: string;
  prixParHeure: number;
  ville: string;
  coursEnLigne: boolean;
  anneesExperience: number;
  noteMoyenne: number;
  disponibilite: string;
  descriptionCourte: string;
  descriptionComplete?: string;
  diplomes?: string[];
  photo?: string;
  avis?: Review[];
}

export interface Review {
  id: number;
  nomEleve: string;
  note: number;
  commentaire: string;
  date: string;
}

export type SortOption = 'prix-croissant' | 'prix-decroissant' | 'note' | 'experience';

export interface FilterOptions {
  matiere?: string;
  prixMin?: number;
  prixMax?: number;
  ville?: string;
  coursEnLigne?: boolean;
  niveauEnseigne?: string;
}

