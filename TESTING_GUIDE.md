# Guide de Test - Back Office et Espace Professeur

## 🚀 Prérequis

1. **Backend démarré** :
   ```bash
   cd backend
   symfony server:start
   # ou
   php -S localhost:8000 -t public
   ```

2. **Frontend démarré** :
   ```bash
   ng serve
   ```

3. **Base de données** : PostgreSQL avec les tables créées

## 📝 Étape 1 : Créer un utilisateur Admin

### Option A : Via SQL direct

```sql
-- Se connecter à PostgreSQL
psql -U postgres -d educonnect

-- Insérer un utilisateur admin
INSERT INTO "user" (email, full_name, roles, password, created_at)
VALUES (
  'admin@educonnect.fr',
  'Administrateur',
  '["ROLE_ADMIN", "ROLE_USER"]'::json,
  '$2y$13$VotreHashDeMotDePasse', -- Générer avec: php bin/console security:hash-password
  NOW()
);
```

### Option B : Via Symfony (recommandé)

1. **Créer un utilisateur normal** via l'API d'inscription
2. **Mettre à jour manuellement** pour ajouter le rôle admin :

```sql
UPDATE "user" 
SET roles = '["ROLE_ADMIN", "ROLE_USER"]'::json 
WHERE email = 'admin@educonnect.fr';
```

### Option C : Créer un script PHP

Créer un fichier `backend/create_admin.php` :

```php
<?php
require __DIR__.'/vendor/autoload.php';

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

$kernel = new App\Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();

$container = $kernel->getContainer();
$em = $container->get('doctrine')->getManager();
$hasher = $container->get('security.password_hasher');

$admin = new User();
$admin->setEmail('admin@educonnect.fr');
$admin->setFullName('Administrateur');
$admin->setRoles(['ROLE_ADMIN', 'ROLE_USER']);
$admin->setPassword($hasher->hashPassword($admin, 'admin123'));

$em->persist($admin);
$em->flush();

echo "Admin créé avec succès!\n";
echo "Email: admin@educonnect.fr\n";
echo "Password: admin123\n";
```

Puis exécuter :
```bash
cd backend
php create_admin.php
```

## 🧪 Étape 2 : Tester l'API avec Postman

### 1. Inscription d'un utilisateur normal

**POST** `http://localhost:8000/api/auth/register`
```json
{
  "fullName": "Jean Dupont",
  "email": "jean@example.com",
  "password": "password123"
}
```

**Réponse attendue** :
```json
{
  "message": "Compte créé avec succès",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "jean@example.com",
    "fullName": "Jean Dupont",
    "roles": ["ROLE_USER"]
  }
}
```

### 2. Connexion

**POST** `http://localhost:8000/api/auth/login`
```json
{
  "email": "jean@example.com",
  "password": "password123"
}
```

**Copier le token** de la réponse pour les prochaines requêtes.

### 3. Créer un profil professeur (Espace Professeur)

**POST** `http://localhost:8000/api/professor/profile`
**Headers** :
```
Authorization: Bearer VOTRE_TOKEN
Content-Type: application/json
```

**Body** :
```json
{
  "nom": "Jean Dupont",
  "matiere": "Maths",
  "niveauEnseigne": "Collège, Lycée",
  "prixParHeure": 25,
  "ville": "Paris",
  "coursEnLigne": true,
  "anneesExperience": 5,
  "descriptionCourte": "Professeur de mathématiques expérimenté avec 5 ans d'expérience",
  "descriptionComplete": "Je suis spécialisé dans l'enseignement des mathématiques au collège et lycée. Ma méthode pédagogique s'adapte à chaque élève.",
  "diplomes": ["Master en Mathématiques", "CAPES"],
  "photo": "https://i.pravatar.cc/150?img=1"
}
```

### 4. Voir son profil (Espace Professeur)

**GET** `http://localhost:8000/api/professor/profile`
**Headers** :
```
Authorization: Bearer VOTRE_TOKEN
```

### 5. Back Office - Dashboard (Admin uniquement)

**GET** `http://localhost:8000/api/admin/dashboard`
**Headers** :
```
Authorization: Bearer TOKEN_ADMIN
```

### 6. Back Office - Liste des professeurs

**GET** `http://localhost:8000/api/admin/teachers?statut=pending`
**Headers** :
```
Authorization: Bearer TOKEN_ADMIN
```

### 7. Back Office - Approuver un professeur

**PUT** `http://localhost:8000/api/admin/teachers/1/approve`
**Headers** :
```
Authorization: Bearer TOKEN_ADMIN
```

### 8. API Publique - Liste des professeurs approuvés

**GET** `http://localhost:8000/api/teachers`
(Pas besoin de token)

## 🌐 Étape 3 : Tester le Frontend

### 1. Tester l'inscription/connexion

1. Aller sur `http://localhost:4200/inscription`
2. Créer un compte
3. Se connecter sur `http://localhost:4200/connexion`

### 2. Tester l'espace professeur

1. **Se connecter** avec un compte utilisateur
2. Aller sur `http://localhost:4200/professeur/profil/nouveau`
3. **Créer un profil** professeur
4. Vérifier le profil sur `http://localhost:4200/professeur/profil`
5. **Modifier** le profil sur `http://localhost:4200/professeur/profil/modifier`

### 3. Tester le back office (Admin)

1. **Se connecter** avec un compte admin
2. Aller sur `http://localhost:4200/admin`
3. Voir le **dashboard** avec les statistiques
4. Aller sur `http://localhost:4200/admin/professeurs`
5. **Approuver/Rejeter** des professeurs
6. Voir les **utilisateurs** sur `http://localhost:4200/admin/utilisateurs`

### 4. Vérifier l'affichage public

1. Une fois un professeur **approuvé** par l'admin
2. Aller sur `http://localhost:4200/professeurs`
3. Le professeur devrait apparaître dans la liste

## 🔍 Checklist de test

### Backend API
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne et retourne un token
- [ ] Création de profil professeur fonctionne
- [ ] Modification de profil fonctionne
- [ ] Dashboard admin retourne les statistiques
- [ ] Liste des professeurs (admin) fonctionne
- [ ] Approuver/Rejeter un professeur fonctionne
- [ ] API publique retourne uniquement les professeurs approuvés

### Frontend
- [ ] Inscription/Connexion fonctionne
- [ ] Header affiche les liens selon le rôle
- [ ] Espace professeur accessible après connexion
- [ ] Création de profil fonctionne
- [ ] Modification de profil fonctionne
- [ ] Back office accessible uniquement aux admins
- [ ] Dashboard admin affiche les statistiques
- [ ] Gestion des professeurs fonctionne
- [ ] Les professeurs approuvés apparaissent dans la liste publique

## 🐛 Dépannage

### Erreur 401 (Unauthorized)
- Vérifier que le token est bien envoyé dans les headers
- Vérifier que le token n'est pas expiré
- Se reconnecter pour obtenir un nouveau token

### Erreur 403 (Forbidden)
- Vérifier que l'utilisateur a le bon rôle (ROLE_ADMIN pour le back office)
- Vérifier que l'utilisateur est bien connecté

### Erreur 500 (Server Error)
- Vérifier les logs du serveur Symfony
- Vérifier que la base de données est accessible
- Vérifier que toutes les migrations sont exécutées

### Le professeur n'apparaît pas dans la liste publique
- Vérifier que le statut est "approved" dans la base de données
- Vérifier que l'API `/api/teachers` retourne bien les données

## 📊 Test du flux complet

1. **Créer un utilisateur** normal → Inscription
2. **Se connecter** → Récupérer le token
3. **Créer un profil professeur** → Statut "pending"
4. **Se connecter en admin** → Récupérer le token admin
5. **Voir le dashboard** → Vérifier les statistiques
6. **Approuver le professeur** → Statut "approved"
7. **Vérifier la liste publique** → Le professeur apparaît

