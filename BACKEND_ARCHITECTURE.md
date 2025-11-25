# Architecture Backend & Fonctionnalités - EduConnect

## 1. Description des Fonctionnalités Backend

### 1.1 Authentification et Autorisation

#### Inscription Utilisateur
- **Endpoint** : `POST /api/auth/register`
- **Logique** :
  - Validation des données (email unique, mot de passe min 8 caractères)
  - Hashage du mot de passe avec `bcrypt` (via Symfony PasswordHasher)
  - Création d'un utilisateur avec rôle `ROLE_USER` par défaut
  - Génération d'un token JWT pour authentification immédiate
  - Retour des informations utilisateur (sans mot de passe)

#### Inscription Professeur
- **Endpoint** : `POST /api/auth/register-teacher`
- **Logique** :
  - Création simultanée de l'utilisateur (avec rôles `ROLE_TEACHER` et `ROLE_USER`)
  - Création automatique du profil `Teacher` associé
  - Statut initial : `pending` (en attente de validation admin)
  - Validation de tous les champs obligatoires (nom, matière, niveau, prix, ville, description)
  - Stockage des diplômes en format JSON (tableau)

#### Connexion
- **Endpoint** : `POST /api/auth/login`
- **Logique** :
  - Vérification de l'email (insensible à la casse)
  - Vérification du mot de passe avec `password_verify()`
  - Génération d'un token JWT contenant l'ID utilisateur et les rôles
  - Retour du token et des informations utilisateur

#### Gestion des Rôles
- **ROLE_USER** : Utilisateur standard (client)
- **ROLE_TEACHER** : Professeur (accès à l'espace professeur)
- **ROLE_ADMIN** : Administrateur (accès au back office)
- Les rôles sont stockés dans un tableau JSON dans la table `user`

---

### 1.2 Recherche et Filtrage des Professeurs

#### Recherche de Base
- **Endpoint** : `GET /api/teachers`
- **Filtres disponibles** :
  - `matiere` : Filtre exact par matière (ex: "Maths", "Anglais")
  - `ville` : Filtre exact par ville (ex: "Paris", "Lyon")
  - `coursEnLigne` : Boolean (true/false) pour cours en ligne uniquement
  - `statut` : Toujours fixé à `'approved'` pour les utilisateurs publics

#### Logique de Filtrage
```php
// Construction dynamique des critères
$criteria = ['statut' => 'approved']; // Seuls les professeurs approuvés sont visibles

if ($matiere) {
    $criteria['matiere'] = $matiere; // Filtre exact
}
if ($ville) {
    $criteria['ville'] = $ville; // Filtre exact
}
if ($coursEnLigne !== null) {
    $criteria['coursEnLigne'] = filter_var($coursEnLigne, FILTER_VALIDATE_BOOLEAN);
}
```

#### Recherche Textuelle (Frontend)
- Actuellement gérée côté frontend pour plus de flexibilité
- Recherche dans : nom, matière, ville, description courte
- Utilisation de `includes()` JavaScript pour correspondance partielle
- **Amélioration future** : Implémentation d'une recherche full-text avec PostgreSQL (tsvector/tsquery)

#### Filtrage par Prix (Frontend)
- Filtrage côté client pour performance
- Les prix sont stockés en `DECIMAL(10,2)` dans la base
- Comparaison : `prixParHeure >= prixMin AND prixParHeure <= prixMax`
- **Amélioration future** : Filtrage SQL pour grandes quantités de données

---

### 1.3 Tri des Résultats

#### Options de Tri Disponibles
- **Par défaut** : Tri par date de création décroissante (`createdAt DESC`)
- **Tri par prix** : Croissant ou décroissant (géré côté frontend)
- **Tri par note** : Décroissant (géré côté frontend, nécessite calcul de moyenne)
- **Tri par expérience** : Décroissant par `anneesExperience` (géré côté frontend)

#### Logique de Tri Backend
```php
// Tri par défaut dans la requête
$teachers = $this->teacherRepository->findBy(
    $criteria,
    ['createdAt' => 'DESC'], // Ordre de tri
    $limit,
    ($page - 1) * $limit
);
```

**Amélioration future** : Implémentation de tri SQL pour meilleures performances :
- `ORDER BY prixParHeure ASC/DESC`
- `ORDER BY anneesExperience DESC`
- `ORDER BY noteMoyenne DESC` (nécessite calcul via jointure avec table `Review`)

---

### 1.4 Pagination

#### Implémentation
- **Paramètres** :
  - `page` : Numéro de page (défaut : 1, minimum : 1)
  - `limit` : Nombre d'éléments par page (défaut : 20, min : 1, max : 50)
- **Calcul de l'offset** : `($page - 1) * $limit`
- **Retour** :
  ```json
  {
    "data": [...],
    "total": 150,
    "page": 1,
    "limit": 20
  }
  ```

#### Logique
```php
$page = max(1, (int) $request->query->get('page', 1));
$limit = min(50, max(1, (int) $request->query->get('limit', 20)));

$teachers = $this->teacherRepository->findBy(
    $criteria,
    ['createdAt' => 'DESC'],
    $limit,                    // LIMIT
    ($page - 1) * $limit        // OFFSET
);

$total = $this->teacherRepository->count($criteria); // Total pour pagination
```

---

### 1.5 Affichage des Professeurs Similaires

#### Logique Actuelle (Frontend)
- Calcul côté client basé sur :
  - Même matière
  - Même niveau enseigné
  - Même ville (ou cours en ligne)
  - Exclut le professeur actuel

#### Logique Backend Recommandée
```sql
SELECT * FROM teacher 
WHERE statut = 'approved'
  AND matiere = :matiere
  AND niveauEnseigne LIKE '%:niveau%'
  AND (ville = :ville OR coursEnLigne = true)
  AND id != :currentTeacherId
ORDER BY anneesExperience DESC, prixParHeure ASC
LIMIT 4
```

**Critères de similarité** :
1. Même matière (priorité 1)
2. Niveau compatible (priorité 2)
3. Localisation proche ou cours en ligne (priorité 3)
4. Expérience et prix comme facteurs de classement

---

### 1.6 Système de Favoris

#### Architecture Actuelle
- **Stockage** : LocalStorage côté frontend (temporaire)
- **Structure** : Tableau d'IDs de professeurs `[1, 5, 12]`

#### Architecture Backend Recommandée
- **Table** : `favorite`
- **Relations** :
  - `user_id` → `user.id` (ManyToOne)
  - `teacher_id` → `teacher.id` (ManyToOne)
  - Contrainte unique : `(user_id, teacher_id)`

#### Logique Métier
```php
// Ajouter aux favoris
POST /api/favorites
{
  "teacherId": 5
}

// Vérification : Si la combinaison (user_id, teacher_id) existe déjà → erreur
// Sinon : INSERT INTO favorite (user_id, teacher_id, created_at) VALUES (...)

// Retirer des favoris
DELETE /api/favorites/{teacherId}

// Liste des favoris
GET /api/favorites
// Retourne la liste des professeurs favoris avec leurs informations complètes
```

---

### 1.7 Gestion des Statuts des Professeurs

#### Statuts Disponibles
- **`pending`** : En attente de validation par un administrateur
- **`approved`** : Approuvé, visible publiquement
- **`rejected`** : Rejeté, non visible publiquement

#### Workflow
1. **Inscription** : Statut initial = `pending`
2. **Validation Admin** : Changement vers `approved` ou `rejected`
3. **Affichage Public** : Seuls les professeurs `approved` sont retournés par l'API publique

#### Logique de Filtrage
```php
// API publique : Toujours filtrer par statut = 'approved'
$criteria = ['statut' => 'approved'];

// Back office : Afficher tous les statuts avec filtres
$criteria = [];
if ($statut) {
    $criteria['statut'] = $statut;
}
```

---

### 1.8 Calcul des Notes Moyennes

#### Architecture Actuelle
- Note moyenne par défaut : 4.5 (temporaire, côté frontend)

#### Architecture Recommandée
- **Table** : `review`
- **Champs** :
  - `id` (PK)
  - `user_id` (FK → user) : Élève qui a laissé l'avis
  - `teacher_id` (FK → teacher) : Professeur évalué
  - `note` (INT, 1-5) : Note sur 5
  - `commentaire` (TEXT) : Commentaire
  - `created_at` (DATETIME)

#### Calcul de la Note Moyenne
```sql
-- Calcul en temps réel
SELECT AVG(note) as noteMoyenne 
FROM review 
WHERE teacher_id = :teacherId

-- Ou stockage calculé (meilleure performance)
ALTER TABLE teacher ADD COLUMN noteMoyenne DECIMAL(3,2);
-- Mise à jour via trigger ou lors de l'ajout d'un avis
```

---

## 2. Architecture de Données

### 2.1 Schéma de Base de Données

```
┌─────────────────────────────────────────────────────────────┐
│                        TABLE: user                          │
├─────────────────────────────────────────────────────────────┤
│ PK  id                  INT (AUTO_INCREMENT)               │
│     email               VARCHAR(180) UNIQUE                 │
│     full_name           VARCHAR(100)                        │
│     password             VARCHAR(255) [HASHED]              │
│     roles                JSON ARRAY                         │
│     phone                VARCHAR(20) NULLABLE               │
│     created_at           DATETIME_IMMUTABLE                 │
│     updated_at           DATETIME_IMMUTABLE NULLABLE         │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1:N
                            │
┌─────────────────────────────────────────────────────────────┐
│                      TABLE: teacher                         │
├─────────────────────────────────────────────────────────────┤
│ PK  id                  INT (AUTO_INCREMENT)                │
│ FK  user_id             INT → user.id (CASCADE DELETE)      │
│     nom                 VARCHAR(100)                         │
│     matiere              VARCHAR(100)                        │
│     niveau_enseigne      VARCHAR(200)                        │
│     prix_par_heure       DECIMAL(10,2)                      │
│     ville                VARCHAR(100)                       │
│     cours_en_ligne       BOOLEAN (default: false)           │
│     annees_experience    INT (default: 0)                   │
│     description_courte   TEXT                                │
│     description_complete TEXT NULLABLE                      │
│     diplomes             JSON ARRAY NULLABLE               │
│     photo                 VARCHAR(255) NULLABLE             │
│     statut               VARCHAR(50) (pending/approved/    │
│                                      rejected)              │
│     created_at           DATETIME_IMMUTABLE                 │
│     updated_at           DATETIME_IMMUTABLE NULLABLE        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1:N
                            │
┌─────────────────────────────────────────────────────────────┐
│                      TABLE: favorite                        │
│                    (À IMPLÉMENTER)                           │
├─────────────────────────────────────────────────────────────┤
│ PK  id                  INT (AUTO_INCREMENT)                │
│ FK  user_id             INT → user.id (CASCADE DELETE)      │
│ FK  teacher_id          INT → teacher.id (CASCADE DELETE)   │
│     created_at           DATETIME_IMMUTABLE                 │
│                                                              │
│ UNIQUE (user_id, teacher_id)                                │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                       TABLE: review                          │
│                    (À IMPLÉMENTER)                          │
├─────────────────────────────────────────────────────────────┤
│ PK  id                  INT (AUTO_INCREMENT)                 │
│ FK  user_id             INT → user.id (CASCADE DELETE)      │
│ FK  teacher_id          INT → teacher.id (CASCADE DELETE)   │
│     note                INT (1-5)                           │
│     commentaire         TEXT NULLABLE                        │
│     created_at          DATETIME_IMMUTABLE                  │
│                                                              │
│ UNIQUE (user_id, teacher_id) [Un avis par utilisateur]     │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.2 Relations Entre Entités

#### User ↔ Teacher
- **Relation** : One-to-Many (1 utilisateur peut avoir 1 profil professeur)
- **Cardinalité** : `User (1) ────< (0..1) Teacher`
- **Contrainte** : Un `User` peut être un `Teacher` (via le champ `user_id` dans `teacher`)
- **Cascade** : Suppression en cascade (`ON DELETE CASCADE`) : si un utilisateur est supprimé, son profil professeur l'est aussi

#### User ↔ Favorite
- **Relation** : One-to-Many (1 utilisateur peut avoir plusieurs favoris)
- **Cardinalité** : `User (1) ────< (N) Favorite`
- **Contrainte** : Un utilisateur ne peut ajouter le même professeur qu'une seule fois (UNIQUE `user_id, teacher_id`)

#### Teacher ↔ Favorite
- **Relation** : One-to-Many (1 professeur peut être favori de plusieurs utilisateurs)
- **Cardinalité** : `Teacher (1) ────< (N) Favorite`

#### User ↔ Review
- **Relation** : One-to-Many (1 utilisateur peut laisser plusieurs avis)
- **Cardinalité** : `User (1) ────< (N) Review`
- **Contrainte** : Un utilisateur ne peut laisser qu'un seul avis par professeur (UNIQUE `user_id, teacher_id`)

#### Teacher ↔ Review
- **Relation** : One-to-Many (1 professeur peut recevoir plusieurs avis)
- **Cardinalité** : `Teacher (1) ────< (N) Review`

---

### 2.3 Champs Clés et Index

#### Table `user`
- **Clé primaire** : `id`
- **Index unique** : `email` (pour connexion rapide)
- **Index** : `roles` (pour filtrage par rôle, si supporté par PostgreSQL)

#### Table `teacher`
- **Clé primaire** : `id`
- **Clé étrangère** : `user_id` (index automatique)
- **Index recommandés** :
  - `statut` : Pour filtrer rapidement les professeurs approuvés
  - `matiere` : Pour recherche/filtrage par matière
  - `ville` : Pour recherche/filtrage par ville
  - `cours_en_ligne` : Pour filtrage boolean
  - `prix_par_heure` : Pour tri par prix
  - `created_at` : Pour tri chronologique

#### Table `favorite` (à créer)
- **Clé primaire** : `id`
- **Clés étrangères** : `user_id`, `teacher_id` (index automatiques)
- **Index unique composite** : `(user_id, teacher_id)` : Empêche les doublons

#### Table `review` (à créer)
- **Clé primaire** : `id`
- **Clés étrangères** : `user_id`, `teacher_id` (index automatiques)
- **Index unique composite** : `(user_id, teacher_id)` : Un avis par utilisateur/professeur
- **Index** : `teacher_id` : Pour calcul rapide de la moyenne

---

### 2.4 Types de Données

#### Types PostgreSQL Utilisés
- **INT** : Identifiants, années d'expérience
- **VARCHAR(n)** : Textes de longueur fixe (noms, emails, villes)
- **TEXT** : Textes longs (descriptions)
- **DECIMAL(10,2)** : Prix (précision monétaire)
- **BOOLEAN** : Valeurs true/false (cours en ligne)
- **JSON/JSONB** : Tableaux (diplômes, rôles)
- **DATETIME_IMMUTABLE** : Dates de création/modification

---

## 3. Requêtes SQL Exemples

### 3.1 Recherche avec Filtres
```sql
SELECT t.*, u.email, u.full_name
FROM teacher t
INNER JOIN "user" u ON t.user_id = u.id
WHERE t.statut = 'approved'
  AND t.matiere = 'Maths'
  AND t.ville = 'Paris'
  AND t.cours_en_ligne = true
  AND t.prix_par_heure BETWEEN 20 AND 30
ORDER BY t.created_at DESC
LIMIT 20 OFFSET 0;
```

### 3.2 Professeurs Similaires
```sql
SELECT t.*
FROM teacher t
WHERE t.statut = 'approved'
  AND t.matiere = 'Maths'
  AND t.niveau_enseigne LIKE '%Lycée%'
  AND (t.ville = 'Paris' OR t.cours_en_ligne = true)
  AND t.id != 5
ORDER BY t.annees_experience DESC, t.prix_par_heure ASC
LIMIT 4;
```

### 3.3 Calcul Note Moyenne (avec table review)
```sql
SELECT 
    t.id,
    t.nom,
    COALESCE(AVG(r.note), 4.5) as note_moyenne,
    COUNT(r.id) as nombre_avis
FROM teacher t
LEFT JOIN review r ON t.id = r.teacher_id
WHERE t.statut = 'approved'
GROUP BY t.id, t.nom;
```

### 3.4 Liste des Favoris d'un Utilisateur
```sql
SELECT t.*
FROM teacher t
INNER JOIN favorite f ON t.id = f.teacher_id
WHERE f.user_id = 1
  AND t.statut = 'approved'
ORDER BY f.created_at DESC;
```

---

## 4. Optimisations Futures

### 4.1 Recherche Full-Text
- Utilisation de `tsvector` et `tsquery` PostgreSQL
- Index GIN sur les champs de recherche (nom, description)
- Recherche floue avec similarité (pg_trgm)

### 4.2 Cache
- Cache Redis pour les résultats de recherche fréquents
- Cache des professeurs approuvés (invalidation lors de changement de statut)
- Cache des notes moyennes (mise à jour asynchrone)

### 3.3 Calculs Asynchrones
- Calcul des notes moyennes via jobs (queue)
- Génération de recommandations en arrière-plan
- Statistiques agrégées (dashboard admin)

---

*Document créé pour le projet EduConnect - Plateforme de cours particuliers*

