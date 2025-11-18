# EduConnect - Plateforme de Cours Particuliers

Plateforme web développée en Angular pour la recherche et la mise en relation avec des professeurs particuliers.

##  Fonctionnalités

### Fonctionnalités principales
-  **Recherche textuelle** : Recherche par nom, matière ou ville
- **Recherche multi-critères** : Filtrage par matière et niveau
-  **Filtres avancés** :
  - Filtre par prix (slider avec intervalle)
  - Filtre par ville
  - Filtre cours en ligne / à domicile
  - Filtre par niveau enseigné
-  **Tri** :
  - Par prix (croissant/décroissant)
  - Par note
  - Par expérience
-  **Affichage des résultats** : Cards avec informations essentielles
-  **Fiche détaillée** : Profil complet du professeur
-  **Système de favoris** : Sauvegarde des professeurs préférés

### Pages disponibles
1. **Page d'accueil** (`/`) : Hero section avec recherche et catégories
2. **Page de résultats** (`/professeurs`) : Liste avec filtres et tri
3. **Page de détails** (`/professeur/:id`) : Fiche complète du professeur
4. **Page favoris** (`/favoris`) : Liste des professeurs favoris
5. **Page À propos** (`/a-propos`) : Informations sur la plateforme
6. **Page Contact** (`/contact`) : Formulaire de contact

##  Installation

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Lancer le serveur de développement**
```bash
npm start
```

3. **Ouvrir dans le navigateur**
```
http://localhost:4200
```

##  Structure du projet

```
src/
├── app/
│   ├── components/
│   │   └── header/          # Composant header/navigation
│   ├── models/
│   │   └── teacher.model.ts # Interfaces TypeScript
│   ├── pages/
│   │   ├── home/            # Page d'accueil
│   │   ├── results/        # Page de résultats
│   │   ├── teacher-detail/ # Page de détails
│   │   ├── favorites/      # Page favoris
│   │   ├── about/          # Page À propos
│   │   └── contact/         # Page Contact
│   ├── services/
│   │   ├── teacher.service.ts    # Service de gestion des professeurs
│   │   └── favorites.service.ts # Service de gestion des favoris
│   ├── app.component.ts     # Composant racine
│   └── app.routes.ts        # Configuration du routing
├── styles.css               # Styles globaux
└── index.html               # Point d'entrée HTML
```

##  Style Guide

### Couleurs
- **Primaire** : `#4A6CF7` (bleu éducation)
- **Secondaire** : `#F5F7FF` (gris clair)
- **Texte** : `#1F1F1F`

### Typographies
- **Titres** : Poppins Bold
- **Texte** : Inter Regular

### Composants
- **Boutons** : Coins arrondis 8px
- **Cards** : Coins arrondis 12px, ombre légère

##  Dataset

Le projet contient **22 professeurs** avec les données suivantes :
- Nom
- Matière enseignée
- Niveau enseigné
- Prix par heure
- Ville
- Cours en ligne (oui/non)
- Années d'expérience
- Note moyenne
- Disponibilité
- Description
- Diplômes
- Avis (pour certains professeurs)

##  Technologies utilisées

- **Angular 17** : Framework frontend
- **TypeScript** : Langage de programmation
- **RxJS** : Programmation réactive
- **CSS3** : Styles personnalisés
- **HTML5** : Structure

##  Responsive Design

Le site est entièrement responsive et s'adapte aux différentes tailles d'écran :
- Desktop (> 968px)
- Tablet (768px - 968px)
- Mobile (< 768px)

##  Parcours utilisateur

1. L'utilisateur arrive sur la page d'accueil
2. Il peut rechercher une matière ou un professeur
3. Il filtre les résultats selon ses critères
4. Il trie les résultats
5. Il consulte les cards et clique sur un professeur
6. Il lit la fiche détaillée
7. Il peut ajouter aux favoris ou contacter le professeur

##  Notes

- Les favoris sont sauvegardés dans le localStorage du navigateur
- Les données sont stockées en mémoire (service Angular)
- Les photos des professeurs utilisent un service externe (pravatar.cc)

##  Développement

Pour construire le projet en production :
```bash
npm run build
```

Les fichiers seront générés dans le dossier `dist/educonnect`.


