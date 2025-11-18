import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Teacher, FilterOptions, SortOption } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private teachers: Teacher[] = [
    {
      id: 1,
      nom: 'Julie Martin',
      matiere: 'Maths',
      niveauEnseigne: 'Collège, Lycée',
      prixParHeure: 25,
      ville: 'Paris',
      coursEnLigne: true,
      anneesExperience: 7,
      noteMoyenne: 4.8,
      disponibilite: 'Lundi-Vendredi: 17h-20h, Samedi: 10h-18h',
      descriptionCourte: 'Prof de maths expérimentée, spécialisée en algèbre et géométrie',
      descriptionComplete: 'Professeure de mathématiques depuis 7 ans, je suis spécialisée dans l\'enseignement au collège et lycée. J\'aide mes élèves à surmonter leurs difficultés en algèbre, géométrie et analyse. Ma méthode pédagogique s\'adapte à chaque élève pour garantir des résultats durables.',
      diplomes: ['Master en Mathématiques', 'CAPES Mathématiques'],
      photo: 'https://i.pravatar.cc/150?img=1',
      avis: [
        { id: 1, nomEleve: 'Sophie L.', note: 5, commentaire: 'Excellent professeur, très patiente et pédagogue !', date: '2024-01-15' },
        { id: 2, nomEleve: 'Thomas M.', note: 4.5, commentaire: 'Mes notes ont considérablement augmenté grâce à Julie.', date: '2024-02-10' }
      ]
    },
    {
      id: 2,
      nom: 'Pierre Dubois',
      matiere: 'Anglais',
      niveauEnseigne: 'Primaire, Collège, Lycée',
      prixParHeure: 22,
      ville: 'Lyon',
      coursEnLigne: true,
      anneesExperience: 5,
      noteMoyenne: 4.6,
      disponibilite: 'Mardi-Jeudi: 18h-20h, Samedi: 9h-12h',
      descriptionCourte: 'Professeur d\'anglais natif, cours interactifs et ludiques',
      descriptionComplete: 'Professeur d\'anglais bilingue avec 5 ans d\'expérience. J\'enseigne l\'anglais de manière interactive et ludique, en me concentrant sur la conversation et la compréhension orale. Mes cours sont adaptés à tous les niveaux.',
      diplomes: ['Master en Langues Étrangères', 'TOEFL Certified'],
      photo: 'https://i.pravatar.cc/150?img=12',
      avis: [
        { id: 3, nomEleve: 'Emma R.', note: 5, commentaire: 'Super prof, mes progrès sont impressionnants !', date: '2024-01-20' }
      ]
    },
    {
      id: 3,
      nom: 'Marie Leclerc',
      matiere: 'Informatique',
      niveauEnseigne: 'Lycée, Université',
      prixParHeure: 30,
      ville: 'Paris',
      coursEnLigne: true,
      anneesExperience: 8,
      noteMoyenne: 4.9,
      disponibilite: 'Lundi-Mercredi-Vendredi: 19h-21h',
      descriptionCourte: 'Développeuse expérimentée, spécialisée en programmation',
      descriptionComplete: 'Développeuse web avec 8 ans d\'expérience, je propose des cours en programmation (Python, JavaScript, Java) et en développement web. J\'aide les étudiants à maîtriser les concepts fondamentaux et à réaliser leurs projets.',
      diplomes: ['Master en Informatique', 'Ingénieur en Informatique'],
      photo: 'https://i.pravatar.cc/150?img=5',
      avis: [
        { id: 4, nomEleve: 'Lucas D.', note: 5, commentaire: 'Marie est une excellente pédagogue, je recommande !', date: '2024-02-05' }
      ]
    },
    {
      id: 4,
      nom: 'Jean Bernard',
      matiere: 'Physique-Chimie',
      niveauEnseigne: 'Lycée, Université',
      prixParHeure: 28,
      ville: 'Marseille',
      coursEnLigne: false,
      anneesExperience: 10,
      noteMoyenne: 4.7,
      disponibilite: 'Lundi-Vendredi: 16h-19h',
      descriptionCourte: 'Professeur de physique-chimie, préparation au bac et concours',
      descriptionComplete: 'Professeur de physique-chimie avec 10 ans d\'expérience. Je prépare mes élèves au baccalauréat et aux concours scientifiques. Ma méthode combine théorie et pratique avec des expériences concrètes.',
      diplomes: ['Doctorat en Physique', 'Agrégation Physique-Chimie'],
      photo: 'https://i.pravatar.cc/150?img=15',
      avis: []
    },
    {
      id: 5,
      nom: 'Sophie Durand',
      matiere: 'SVT',
      niveauEnseigne: 'Collège, Lycée',
      prixParHeure: 20,
      ville: 'Toulouse',
      coursEnLigne: true,
      anneesExperience: 6,
      noteMoyenne: 4.5,
      disponibilite: 'Mercredi: 14h-18h, Samedi: 10h-16h',
      descriptionCourte: 'Prof de SVT passionnée, cours adaptés à chaque élève',
      descriptionComplete: 'Professeure de SVT depuis 6 ans, je suis passionnée par les sciences de la vie. J\'aide mes élèves à comprendre les mécanismes biologiques et à réussir leurs examens avec des méthodes pédagogiques innovantes.',
      diplomes: ['Master en Biologie', 'CAPES SVT'],
      photo: 'https://i.pravatar.cc/150?img=9',
      avis: []
    },
    {
      id: 6,
      nom: 'Antoine Moreau',
      matiere: 'Économie',
      niveauEnseigne: 'Lycée, Université',
      prixParHeure: 35,
      ville: 'Paris',
      coursEnLigne: true,
      anneesExperience: 12,
      noteMoyenne: 4.8,
      disponibilite: 'Lundi-Mercredi: 18h-21h',
      descriptionCourte: 'Économiste professionnel, cours de macro et microéconomie',
      descriptionComplete: 'Économiste avec 12 ans d\'expérience dans l\'enseignement supérieur. Je propose des cours en macroéconomie, microéconomie et économie internationale. Préparation aux concours et examens universitaires.',
      diplomes: ['Doctorat en Économie', 'Master en Sciences Économiques'],
      photo: 'https://i.pravatar.cc/150?img=20',
      avis: []
    },
    {
      id: 7,
      nom: 'Camille Rousseau',
      matiere: 'Maths',
      niveauEnseigne: 'Primaire, Collège',
      prixParHeure: 18,
      ville: 'Lille',
      coursEnLigne: false,
      anneesExperience: 4,
      noteMoyenne: 4.4,
      disponibilite: 'Mardi-Jeudi: 17h-19h, Samedi: 9h-13h',
      descriptionCourte: 'Prof de maths pour primaire et collège, méthode douce',
      descriptionComplete: 'Professeure de mathématiques spécialisée dans l\'enseignement primaire et collège. J\'utilise une approche douce et bienveillante pour aider les enfants à surmonter leurs difficultés et à prendre confiance en eux.',
      diplomes: ['Master MEEF', 'CAPES Mathématiques'],
      photo: 'https://i.pravatar.cc/150?img=33',
      avis: []
    },
    {
      id: 8,
      nom: 'Lucas Petit',
      matiere: 'Anglais',
      niveauEnseigne: 'Lycée, Université',
      prixParHeure: 32,
      ville: 'Bordeaux',
      coursEnLigne: true,
      anneesExperience: 9,
      noteMoyenne: 4.7,
      disponibilite: 'Lundi-Vendredi: 19h-21h',
      descriptionCourte: 'Professeur d\'anglais pour niveaux avancés et préparation TOEFL',
      descriptionComplete: 'Professeur d\'anglais avec 9 ans d\'expérience, spécialisé dans la préparation aux examens internationaux (TOEFL, IELTS). Je propose des cours intensifs pour les niveaux avancés et la préparation aux concours.',
      diplomes: ['Master en Langues', 'Certification TOEFL'],
      photo: 'https://i.pravatar.cc/150?img=47',
      avis: []
    },
    {
      id: 9,
      nom: 'Emma Girard',
      matiere: 'Informatique',
      niveauEnseigne: 'Collège, Lycée',
      prixParHeure: 25,
      ville: 'Nantes',
      coursEnLigne: true,
      anneesExperience: 5,
      noteMoyenne: 4.6,
      disponibilite: 'Mercredi: 14h-18h, Samedi-Dimanche: 10h-16h',
      descriptionCourte: 'Prof d\'informatique, initiation à la programmation',
      descriptionComplete: 'Professeure d\'informatique spécialisée dans l\'initiation à la programmation pour les collégiens et lycéens. J\'enseigne Python, Scratch et les bases du développement web de manière ludique et accessible.',
      diplomes: ['Master en Informatique'],
      photo: 'https://i.pravatar.cc/150?img=45',
      avis: []
    },
    {
      id: 10,
      nom: 'Thomas Lefebvre',
      matiere: 'Physique-Chimie',
      niveauEnseigne: 'Collège, Lycée',
      prixParHeure: 24,
      ville: 'Strasbourg',
      coursEnLigne: false,
      anneesExperience: 7,
      noteMoyenne: 4.5,
      disponibilite: 'Lundi-Mercredi-Vendredi: 17h-20h',
      descriptionCourte: 'Prof de physique-chimie, cours à domicile',
      descriptionComplete: 'Professeur de physique-chimie avec 7 ans d\'expérience. Je propose des cours à domicile pour collégiens et lycéens. Ma méthode privilégie la compréhension des concepts fondamentaux et la résolution d\'exercices.',
      diplomes: ['Master en Physique', 'CAPES Physique-Chimie'],
      photo: 'https://i.pravatar.cc/150?img=32',
      avis: []
    },
    {
      id: 11,
      nom: 'Laura Simon',
      matiere: 'SVT',
      niveauEnseigne: 'Lycée',
      prixParHeure: 26,
      ville: 'Nice',
      coursEnLigne: true,
      anneesExperience: 8,
      noteMoyenne: 4.8,
      disponibilite: 'Mardi-Jeudi: 18h-21h, Samedi: 10h-14h',
      descriptionCourte: 'Prof de SVT, préparation au bac scientifique',
      descriptionComplete: 'Professeure de SVT avec 8 ans d\'expérience, spécialisée dans la préparation au baccalauréat scientifique. J\'aide mes élèves à maîtriser les notions de biologie et de géologie avec des méthodes efficaces.',
      diplomes: ['Master en Biologie', 'Agrégation SVT'],
      photo: 'https://i.pravatar.cc/150?img=52',
      avis: []
    },
    {
      id: 12,
      nom: 'Nicolas Blanc',
      matiere: 'Économie',
      niveauEnseigne: 'Lycée',
      prixParHeure: 28,
      ville: 'Rennes',
      coursEnLigne: true,
      anneesExperience: 6,
      noteMoyenne: 4.6,
      disponibilite: 'Lundi-Vendredi: 18h-20h',
      descriptionCourte: 'Prof d\'économie pour lycée, spécialité SES',
      descriptionComplete: 'Professeur d\'économie spécialisé dans l\'enseignement des SES au lycée. Je prépare mes élèves au baccalauréat avec des cours structurés et des exercices pratiques. Ma méthode combine théorie et actualité économique.',
      diplomes: ['Master en Sciences Économiques', 'CAPES SES'],
      photo: 'https://i.pravatar.cc/150?img=28',
      avis: []
    },
    {
      id: 13,
      nom: 'Claire Vincent',
      matiere: 'Maths',
      niveauEnseigne: 'Lycée, Université',
      prixParHeure: 30,
      ville: 'Paris',
      coursEnLigne: true,
      anneesExperience: 11,
      noteMoyenne: 4.9,
      disponibilite: 'Lundi-Mercredi-Vendredi: 19h-22h',
      descriptionCourte: 'Prof de maths niveau supérieur, préparation aux concours',
      descriptionComplete: 'Professeure de mathématiques avec 11 ans d\'expérience, spécialisée dans l\'enseignement supérieur. Je prépare mes étudiants aux concours des grandes écoles et aux examens universitaires avec des méthodes rigoureuses.',
      diplomes: ['Doctorat en Mathématiques', 'Agrégation Mathématiques'],
      photo: 'https://i.pravatar.cc/150?img=36',
      avis: []
    },
    {
      id: 14,
      nom: 'Marc Lavigne',
      matiere: 'Anglais',
      niveauEnseigne: 'Primaire, Collège',
      prixParHeure: 20,
      ville: 'Montpellier',
      coursEnLigne: false,
      anneesExperience: 5,
      noteMoyenne: 4.5,
      disponibilite: 'Mardi-Jeudi: 17h-19h, Samedi: 9h-12h',
      descriptionCourte: 'Prof d\'anglais pour enfants, méthode ludique',
      descriptionComplete: 'Professeur d\'anglais spécialisé dans l\'enseignement aux enfants. J\'utilise des méthodes ludiques et interactives pour rendre l\'apprentissage de l\'anglais amusant et efficace. Cours adaptés aux niveaux primaire et collège.',
      diplomes: ['Master en Langues', 'Certification TEFL'],
      photo: 'https://i.pravatar.cc/150?img=41',
      avis: []
    },
    {
      id: 15,
      nom: 'Isabelle Mercier',
      matiere: 'Informatique',
      niveauEnseigne: 'Université',
      prixParHeure: 40,
      ville: 'Paris',
      coursEnLigne: true,
      anneesExperience: 15,
      noteMoyenne: 5.0,
      disponibilite: 'Lundi-Vendredi: 18h-22h',
      descriptionCourte: 'Prof d\'informatique niveau expert, algorithmes et structures de données',
      descriptionComplete: 'Professeure d\'informatique avec 15 ans d\'expérience dans l\'enseignement supérieur. Spécialisée en algorithmes, structures de données et intelligence artificielle. Préparation aux concours et examens universitaires avancés.',
      diplomes: ['Doctorat en Informatique', 'HDR'],
      photo: 'https://i.pravatar.cc/150?img=48',
      avis: []
    },
    {
      id: 16,
      nom: 'David Martin',
      matiere: 'Physique-Chimie',
      niveauEnseigne: 'Collège',
      prixParHeure: 22,
      ville: 'Lyon',
      coursEnLigne: true,
      anneesExperience: 6,
      noteMoyenne: 4.4,
      disponibilite: 'Mercredi: 14h-18h, Samedi: 10h-16h',
      descriptionCourte: 'Prof de physique-chimie collège, approche expérimentale',
      descriptionComplete: 'Professeur de physique-chimie avec 6 ans d\'expérience au collège. J\'utilise une approche expérimentale pour rendre les sciences accessibles et passionnantes. Mes cours sont adaptés aux programmes du collège.',
      diplomes: ['Master en Physique', 'CAPES Physique-Chimie'],
      photo: 'https://i.pravatar.cc/150?img=55',
      avis: []
    },
    {
      id: 17,
      nom: 'Julie Moreau',
      matiere: 'SVT',
      niveauEnseigne: 'Primaire, Collège',
      prixParHeure: 19,
      ville: 'Toulouse',
      coursEnLigne: false,
      anneesExperience: 4,
      noteMoyenne: 4.3,
      disponibilite: 'Mardi-Jeudi: 16h-18h, Samedi: 9h-13h',
      descriptionCourte: 'Prof de SVT primaire et collège, méthode interactive',
      descriptionComplete: 'Professeure de SVT avec 4 ans d\'expérience, spécialisée dans l\'enseignement primaire et collège. J\'utilise des méthodes interactives et des expériences pratiques pour éveiller la curiosité scientifique des élèves.',
      diplomes: ['Master MEEF', 'CAPES SVT'],
      photo: 'https://i.pravatar.cc/150?img=24',
      avis: []
    },
    {
      id: 18,
      nom: 'François Dubois',
      matiere: 'Économie',
      niveauEnseigne: 'Université',
      prixParHeure: 38,
      ville: 'Paris',
      coursEnLigne: true,
      anneesExperience: 13,
      noteMoyenne: 4.7,
      disponibilite: 'Lundi-Mercredi: 19h-22h',
      descriptionCourte: 'Économiste universitaire, macroéconomie et finance',
      descriptionComplete: 'Économiste avec 13 ans d\'expérience dans l\'enseignement universitaire. Spécialisé en macroéconomie, finance internationale et économétrie. Préparation aux examens et concours de niveau master.',
      diplomes: ['Doctorat en Économie', 'HDR'],
      photo: 'https://i.pravatar.cc/150?img=38',
      avis: []
    },
    {
      id: 19,
      nom: 'Sarah Lemoine',
      matiere: 'Maths',
      niveauEnseigne: 'Collège',
      prixParHeure: 21,
      ville: 'Bordeaux',
      coursEnLigne: true,
      anneesExperience: 5,
      noteMoyenne: 4.5,
      disponibilite: 'Lundi-Vendredi: 17h-19h',
      descriptionCourte: 'Prof de maths collège, aide aux devoirs',
      descriptionComplete: 'Professeure de mathématiques avec 5 ans d\'expérience au collège. Je propose de l\'aide aux devoirs et du soutien scolaire pour aider les élèves à progresser et à prendre confiance en mathématiques.',
      diplomes: ['Master MEEF', 'CAPES Mathématiques'],
      photo: 'https://i.pravatar.cc/150?img=29',
      avis: []
    },
    {
      id: 20,
      nom: 'Paul Garnier',
      matiere: 'Anglais',
      niveauEnseigne: 'Lycée',
      prixParHeure: 27,
      ville: 'Lille',
      coursEnLigne: true,
      anneesExperience: 7,
      noteMoyenne: 4.6,
      disponibilite: 'Mardi-Jeudi: 18h-20h, Samedi: 10h-14h',
      descriptionCourte: 'Prof d\'anglais lycée, préparation au bac',
      descriptionComplete: 'Professeur d\'anglais avec 7 ans d\'expérience, spécialisé dans la préparation au baccalauréat. Je propose des cours axés sur la compréhension écrite, l\'expression orale et la grammaire pour réussir l\'épreuve d\'anglais.',
      diplomes: ['Master en Langues', 'CAPES Anglais'],
      photo: 'https://i.pravatar.cc/150?img=44',
      avis: []
    },
    {
      id: 21,
      nom: 'Amélie Roux',
      matiere: 'Informatique',
      niveauEnseigne: 'Lycée',
      prixParHeure: 28,
      ville: 'Marseille',
      coursEnLigne: true,
      anneesExperience: 6,
      noteMoyenne: 4.7,
      disponibilite: 'Lundi-Mercredi-Vendredi: 18h-21h',
      descriptionCourte: 'Prof d\'informatique lycée, NSI et ISN',
      descriptionComplete: 'Professeure d\'informatique spécialisée dans l\'enseignement de la NSI (Numérique et Sciences Informatiques) au lycée. J\'aide mes élèves à maîtriser Python, les algorithmes et les bases de données.',
      diplomes: ['Master en Informatique', 'CAPES Informatique'],
      photo: 'https://i.pravatar.cc/150?img=50',
      avis: []
    },
    {
      id: 22,
      nom: 'Julien Bernard',
      matiere: 'Physique-Chimie',
      niveauEnseigne: 'Université',
      prixParHeure: 35,
      ville: 'Paris',
      coursEnLigne: true,
      anneesExperience: 10,
      noteMoyenne: 4.8,
      disponibilite: 'Lundi-Vendredi: 19h-22h',
      descriptionCourte: 'Prof de physique-chimie universitaire, niveau master',
      descriptionComplete: 'Professeur de physique-chimie avec 10 ans d\'expérience dans l\'enseignement supérieur. Spécialisé en chimie organique, physique quantique et thermodynamique. Préparation aux examens de niveau master.',
      diplomes: ['Doctorat en Chimie', 'HDR'],
      photo: 'https://i.pravatar.cc/150?img=39',
      avis: []
    },
    {
      id: 23,
      nom: 'Céline Moreau',
      matiere: 'Français',
      niveauEnseigne: 'Collège, Lycée',
      prixParHeure: 24,
      ville: 'Paris',
      coursEnLigne: true,
      anneesExperience: 8,
      noteMoyenne: 4.7,
      disponibilite: 'Lundi-Mercredi-Vendredi: 17h-20h',
      descriptionCourte: 'Prof de français, spécialisée en littérature et préparation au bac',
      descriptionComplete: 'Professeure de français avec 8 ans d\'expérience. Spécialisée en littérature française, grammaire et préparation au baccalauréat. J\'aide mes élèves à améliorer leur expression écrite et orale.',
      diplomes: ['Master en Lettres Modernes', 'CAPES Lettres'],
      photo: 'https://i.pravatar.cc/150?img=10',
      avis: []
    },
    {
      id: 24,
      nom: 'Marc Lefevre',
      matiere: 'Histoire-Géographie',
      niveauEnseigne: 'Collège, Lycée',
      prixParHeure: 23,
      ville: 'Lyon',
      coursEnLigne: true,
      anneesExperience: 6,
      noteMoyenne: 4.6,
      disponibilite: 'Mardi-Jeudi: 18h-21h, Samedi: 10h-14h',
      descriptionCourte: 'Prof d\'histoire-géographie, passionné par l\'enseignement',
      descriptionComplete: 'Professeur d\'histoire-géographie avec 6 ans d\'expérience. Passionné par l\'enseignement, je rends l\'histoire et la géographie vivantes et accessibles. Préparation au brevet et au baccalauréat.',
      diplomes: ['Master en Histoire', 'CAPES Histoire-Géographie'],
      photo: 'https://i.pravatar.cc/150?img=25',
      avis: []
    },
    {
      id: 25,
      nom: 'Isabel Garcia',
      matiere: 'Espagnol',
      niveauEnseigne: 'Collège, Lycée, Université',
      prixParHeure: 26,
      ville: 'Toulouse',
      coursEnLigne: true,
      anneesExperience: 7,
      noteMoyenne: 4.8,
      disponibilite: 'Lundi-Vendredi: 17h-20h',
      descriptionCourte: 'Professeure d\'espagnol native, cours dynamiques',
      descriptionComplete: 'Professeure d\'espagnol native avec 7 ans d\'expérience. J\'enseigne l\'espagnol de manière dynamique et interactive, en me concentrant sur la conversation et la culture hispanique. Cours adaptés à tous les niveaux.',
      diplomes: ['Master en Langues', 'DELE Certified'],
      photo: 'https://i.pravatar.cc/150?img=18',
      avis: []
    },
    {
      id: 26,
      nom: 'Hans Mueller',
      matiere: 'Allemand',
      niveauEnseigne: 'Lycée, Université',
      prixParHeure: 28,
      ville: 'Strasbourg',
      coursEnLigne: true,
      anneesExperience: 9,
      noteMoyenne: 4.7,
      disponibilite: 'Mardi-Jeudi: 18h-21h',
      descriptionCourte: 'Professeur d\'allemand natif, préparation aux examens',
      descriptionComplete: 'Professeur d\'allemand natif avec 9 ans d\'expérience. Spécialisé dans la préparation aux examens (Goethe-Zertifikat) et l\'enseignement universitaire. Méthode efficace pour maîtriser la grammaire et la conversation.',
      diplomes: ['Master en Langues', 'Goethe-Zertifikat'],
      photo: 'https://i.pravatar.cc/150?img=30',
      avis: []
    },
    {
      id: 27,
      nom: 'Sophie Rousseau',
      matiere: 'Philosophie',
      niveauEnseigne: 'Lycée, Université',
      prixParHeure: 32,
      ville: 'Paris',
      coursEnLigne: true,
      anneesExperience: 11,
      noteMoyenne: 4.9,
      disponibilite: 'Lundi-Mercredi-Vendredi: 19h-22h',
      descriptionCourte: 'Prof de philosophie, préparation au bac et concours',
      descriptionComplete: 'Professeure de philosophie avec 11 ans d\'expérience. Spécialisée dans la préparation au baccalauréat et aux concours des grandes écoles. J\'aide mes élèves à développer leur réflexion et leur argumentation.',
      diplomes: ['Doctorat en Philosophie', 'Agrégation Philosophie'],
      photo: 'https://i.pravatar.cc/150?img=14',
      avis: []
    },
    {
      id: 28,
      nom: 'Thomas Leroy',
      matiere: 'Français',
      niveauEnseigne: 'Primaire, Collège',
      prixParHeure: 20,
      ville: 'Lille',
      coursEnLigne: false,
      anneesExperience: 5,
      noteMoyenne: 4.5,
      disponibilite: 'Mardi-Jeudi: 17h-19h, Samedi: 9h-13h',
      descriptionCourte: 'Prof de français primaire et collège, méthode douce',
      descriptionComplete: 'Professeur de français spécialisé dans l\'enseignement primaire et collège. J\'utilise une méthode douce et bienveillante pour aider les enfants à maîtriser la langue française, la grammaire et l\'orthographe.',
      diplomes: ['Master MEEF', 'CAPES Lettres'],
      photo: 'https://i.pravatar.cc/150?img=35',
      avis: []
    },
    {
      id: 29,
      nom: 'Marie Dubois',
      matiere: 'Histoire-Géographie',
      niveauEnseigne: 'Lycée',
      prixParHeure: 25,
      ville: 'Bordeaux',
      coursEnLigne: true,
      anneesExperience: 7,
      noteMoyenne: 4.6,
      disponibilite: 'Lundi-Vendredi: 18h-20h',
      descriptionCourte: 'Prof d\'histoire-géographie, préparation au bac',
      descriptionComplete: 'Professeure d\'histoire-géographie avec 7 ans d\'expérience au lycée. Je prépare mes élèves au baccalauréat avec des méthodes efficaces et des supports visuels. Spécialisée en histoire contemporaine et géographie humaine.',
      diplomes: ['Master en Histoire', 'CAPES Histoire-Géographie'],
      photo: 'https://i.pravatar.cc/150?img=22',
      avis: []
    },
    {
      id: 30,
      nom: 'Carlos Rodriguez',
      matiere: 'Espagnol',
      niveauEnseigne: 'Primaire, Collège',
      prixParHeure: 21,
      ville: 'Marseille',
      coursEnLigne: true,
      anneesExperience: 5,
      noteMoyenne: 4.5,
      disponibilite: 'Mercredi: 14h-18h, Samedi: 10h-16h',
      descriptionCourte: 'Prof d\'espagnol pour enfants, méthode ludique',
      descriptionComplete: 'Professeur d\'espagnol spécialisé dans l\'enseignement aux enfants. J\'utilise des méthodes ludiques et interactives pour rendre l\'apprentissage de l\'espagnol amusant et efficace. Cours adaptés aux niveaux primaire et collège.',
      diplomes: ['Master en Langues', 'Certification TEFL'],
      photo: 'https://i.pravatar.cc/150?img=42',
      avis: []
    }
  ];

  getTeachers(): Observable<Teacher[]> {
    return of(this.teachers);
  }

  getTeacherById(id: number): Observable<Teacher | undefined> {
    const teacher = this.teachers.find(t => t.id === id);
    return of(teacher);
  }

  searchTeachers(query: string, filters: FilterOptions, sortOption: SortOption): Observable<Teacher[]> {
    let results = [...this.teachers];

    // Recherche textuelle
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(teacher =>
        teacher.nom.toLowerCase().includes(lowerQuery) ||
        teacher.matiere.toLowerCase().includes(lowerQuery) ||
        teacher.ville.toLowerCase().includes(lowerQuery)
      );
    }

    // Filtres
    if (filters.matiere) {
      results = results.filter(t => t.matiere === filters.matiere);
    }
    if (filters.prixMin !== undefined) {
      results = results.filter(t => t.prixParHeure >= filters.prixMin!);
    }
    if (filters.prixMax !== undefined) {
      results = results.filter(t => t.prixParHeure <= filters.prixMax!);
    }
    if (filters.ville) {
      results = results.filter(t => t.ville.toLowerCase().includes(filters.ville!.toLowerCase()));
    }
    if (filters.coursEnLigne !== undefined) {
      results = results.filter(t => t.coursEnLigne === filters.coursEnLigne);
    }
    if (filters.niveauEnseigne) {
      results = results.filter(t => t.niveauEnseigne.includes(filters.niveauEnseigne!));
    }

    // Tri
    switch (sortOption) {
      case 'prix-croissant':
        results.sort((a, b) => a.prixParHeure - b.prixParHeure);
        break;
      case 'prix-decroissant':
        results.sort((a, b) => b.prixParHeure - a.prixParHeure);
        break;
      case 'note':
        results.sort((a, b) => b.noteMoyenne - a.noteMoyenne);
        break;
      case 'experience':
        results.sort((a, b) => b.anneesExperience - a.anneesExperience);
        break;
    }

    return of(results);
  }

  getMatières(): Observable<string[]> {
    return of([...new Set(this.teachers.map(t => t.matiere))]);
  }

  getVilles(): Observable<string[]> {
    return of([...new Set(this.teachers.map(t => t.ville))].sort());
  }
}

