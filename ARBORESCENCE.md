# Arborescence du Produit - EduConnect

## Structure Complète du Site

```
EduConnect
│
├── 🏠 ACCUEIL (/)
│   ├── Hero Section
│   ├── Recherche rapide
│   ├── Catégories de matières
│   ├── Professeurs vedettes
│   ├── Témoignages
│   ├── Comment ça marche
│   └── CTA Inscription
│
├── 🔍 RECHERCHE (/professeurs)
│   ├── Barre de recherche
│   ├── Filtres avancés
│   │   ├── Matière
│   │   ├── Niveau
│   │   ├── Ville
│   │   ├── Prix (min/max)
│   │   ├── Cours en ligne / À domicile
│   │   └── Disponibilité
│   ├── Options de tri
│   │   ├── Note décroissante
│   │   ├── Prix croissant
│   │   ├── Prix décroissant
│   │   └── Expérience
│   └── Résultats de recherche
│
├── 📋 RÉSULTATS (/professeurs)
│   ├── Nombre de résultats
│   ├── Grille de cartes professeurs
│   │   ├── Photo
│   │   ├── Nom
│   │   ├── Matière
│   │   ├── Prix/heure
│   │   ├── Note moyenne
│   │   ├── Ville / En ligne
│   │   ├── Années d'expérience
│   │   └── Bouton "Voir le profil"
│   └── Pagination
│
├── 👤 FICHE DÉTAIL PROFESSEUR (/professeur/:id)
│   ├── En-tête
│   │   ├── Photo
│   │   ├── Nom
│   │   ├── Matière
│   │   ├── Note moyenne + étoiles
│   │   └── Bouton favori
│   ├── Informations principales
│   │   ├── Prix par heure
│   │   ├── Ville
│   │   ├── Niveau enseigné
│   │   ├── Années d'expérience
│   │   ├── Cours en ligne / À domicile
│   │   └── Disponibilité
│   ├── Description
│   │   ├── Description courte
│   │   └── Description complète
│   ├── Diplômes et qualifications
│   ├── Avis et commentaires
│   │   ├── Liste des avis
│   │   ├── Note détaillée
│   │   └── Formulaire d'avis (si connecté)
│   ├── Actions
│   │   ├── Bouton "Contacter"
│   │   └── Bouton "Réserver un cours"
│   └── Professeurs similaires
│
├── ⭐ FAVORIS (/favoris)
│   ├── Liste des professeurs favoris
│   ├── Actions rapides
│   │   ├── Voir le profil
│   │   ├── Réserver
│   │   └── Retirer des favoris
│   └── Message si vide
│
├── ℹ️ À PROPOS (/a-propos)
│   ├── Mission
│   ├── Vision
│   ├── Valeurs
│   ├── Équipe
│   └── Chiffres clés
│
├── 📧 CONTACT (/contact)
│   ├── Formulaire de contact
│   ├── Informations de contact
│   └── Carte (optionnel)
│
├── 🔐 AUTHENTIFICATION
│   │
│   ├── Connexion Client (/connexion)
│   │   ├── Formulaire email/mot de passe
│   │   ├── Lien "Mot de passe oublié"
│   │   ├── Lien "Créer un compte"
│   │   └── Lien "Connexion professeur"
│   │
│   ├── Inscription Client (/inscription)
│   │   ├── Formulaire d'inscription
│   │   │   ├── Nom complet
│   │   │   ├── Email
│   │   │   ├── Téléphone (optionnel)
│   │   │   ├── Mot de passe
│   │   │   └── Confirmation mot de passe
│   │   ├── Conditions d'utilisation
│   │   ├── Lien "Déjà un compte ?"
│   │   └── Lien "Inscription professeur"
│   │
│   ├── Connexion Professeur (/professeur/connexion)
│   │   ├── Formulaire email/mot de passe
│   │   ├── Lien "Créer un compte professeur"
│   │   └── Lien "Connexion client"
│   │
│   └── Inscription Professeur (/professeur/inscription)
│       ├── Section 1 : Informations de compte
│       │   ├── Nom complet
│       │   ├── Email
│       │   ├── Téléphone (optionnel)
│       │   ├── Photo (optionnel)
│       │   ├── Mot de passe
│       │   └── Confirmation mot de passe
│       ├── Section 2 : Informations d'enseignement
│       │   ├── Prénom
│       │   ├── Nom
│       │   ├── Matière
│       │   ├── Niveau enseigné
│       │   ├── Prix par heure
│       │   ├── Ville
│       │   ├── Disponibilité
│       │   ├── Années d'expérience
│       │   ├── Cours en ligne
│       │   └── Cours à domicile
│       ├── Section 3 : Description
│       │   ├── Description courte
│       │   └── Description complète
│       └── Section 4 : Diplômes
│
├── 👨‍🎓 ESPACE PROFESSEUR (/professeur)
│   │   (Protégé - Requiert authentification ROLE_TEACHER)
│   │
│   ├── Profil (/professeur/profil)
│   │   ├── Vue d'ensemble
│   │   │   ├── Informations personnelles
│   │   │   ├── Informations d'enseignement
│   │   │   ├── Statut (pending/approved/rejected)
│   │   │   └── Statistiques
│   │   ├── Actions
│   │   │   ├── Modifier le profil
│   │   │   └── Créer le profil (si inexistant)
│   │   └── Redirection si pas de profil
│   │
│   ├── Créer Profil (/professeur/profil/nouveau)
│   │   └── Formulaire complet de création
│   │
│   └── Modifier Profil (/professeur/profil/modifier)
│       └── Formulaire d'édition
│
├── ⚙️ BACK OFFICE ADMIN (/admin)
│   │   (Protégé - Requiert authentification ROLE_ADMIN)
│   │
│   ├── Dashboard (/admin)
│   │   ├── Statistiques générales
│   │   ├── Graphiques
│   │   ├── Activité récente
│   │   └── Actions rapides
│   │
│   ├── Gestion Professeurs (/admin/professeurs)
│   │   ├── Liste des professeurs
│   │   ├── Filtres (statut, matière, etc.)
│   │   ├── Actions
│   │   │   ├── Voir le profil
│   │   │   ├── Approuver
│   │   │   ├── Rejeter
│   │   │   └── Modifier
│   │   └── Recherche
│   │
│   └── Gestion Utilisateurs (/admin/utilisateurs)
│       ├── Liste des utilisateurs
│       ├── Filtres
│       ├── Actions
│       │   ├── Voir le profil
│       │   ├── Modifier
│       │   └── Désactiver
│       └── Recherche
│
└── 👤 PROFIL UTILISATEUR (Optionnel)
    │
    ├── Mon Compte
    │   ├── Informations personnelles
    │   ├── Modifier le mot de passe
    │   └── Préférences
    │
    ├── Mes Réservations
    │   ├── Cours à venir
    │   ├── Historique
    │   └── Annulations
    │
    ├── Mes Favoris
    │   └── (Redirige vers /favoris)
    │
    └── Paramètres
        ├── Notifications
        ├── Confidentialité
        └── Suppression de compte
```

---

## Pages Obligatoires (Conformité)

### ✅ Accueil (/)
- Page d'accueil avec recherche rapide
- Présentation de la plateforme
- Call-to-action principal

### ✅ Recherche (/professeurs)
- Barre de recherche
- Filtres avancés
- Options de tri

### ✅ Résultats (/professeurs)
- Affichage des résultats de recherche
- Grille de cartes professeurs
- Pagination

### ✅ Fiche Détail (/professeur/:id)
- Informations complètes du professeur
- Avis et commentaires
- Actions (contacter, réserver)

### ⚙️ Profil / Paramètres (Optionnel)
- Espace utilisateur connecté
- Gestion du compte
- Historique des réservations

---

## Navigation Principale

### Header (Toutes les pages)
- Logo (lien vers accueil)
- Menu navigation
  - Accueil
  - Professeurs
  - À propos
  - Contact
- Actions
  - Favoris (icône)
  - Connexion / Inscription (dropdown)
    - Client
    - Professeur
  - Menu utilisateur (si connecté)
    - Mon espace professeur (si ROLE_TEACHER)
    - Back office (si ROLE_ADMIN)
    - Déconnexion

### Footer (Toutes les pages)
- Liens utiles
- Informations légales
- Réseaux sociaux
- Contact

---

## États et Redirections

### États de Pages
- **Chargement** : Skeleton screens / Spinners
- **Vide** : Messages explicites (ex: "Aucun professeur trouvé")
- **Erreur** : Messages d'erreur clairs avec actions
- **Succès** : Confirmations visuelles

### Redirections Automatiques
- `/professeur` → `/professeur/profil` (si connecté en tant que professeur)
- `/admin` → `/admin` (dashboard, si admin)
- Routes protégées → Connexion (si non authentifié)
- 404 → Page d'erreur ou redirection accueil

---

## Hiérarchie des Priorités

### Priorité 1 (Essentiel)
1. Accueil
2. Recherche / Résultats
3. Fiche détail professeur
4. Authentification (connexion/inscription)

### Priorité 2 (Important)
5. Favoris
6. Espace professeur (profil)
7. À propos / Contact

### Priorité 3 (Optionnel)
8. Profil utilisateur complet
9. Back office admin
10. Paramètres avancés

---

*Document créé pour le projet EduConnect - Plateforme de cours particuliers*

