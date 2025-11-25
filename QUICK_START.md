# 🚀 Guide de démarrage rapide

## 1. Démarrer les serveurs

### Backend
```bash
cd backend
symfony server:start
# Le backend sera sur http://localhost:8000
```

### Frontend
```bash
ng serve
# Le frontend sera sur http://localhost:4200
```

## 2. Créer un utilisateur Admin

```bash
cd backend
php create_admin.php
```

**Identifiants admin** :
- Email: `admin@educonnect.fr`
- Password: `admin123`

## 3. Tester le flux complet

### A. Test Frontend (Recommandé)

1. **Créer un compte utilisateur normal** :
   - Aller sur `http://localhost:4200/inscription`
   - Créer un compte (ex: `jean@example.com` / `password123`)

2. **Se connecter** :
   - Aller sur `http://localhost:4200/connexion`
   - Se connecter avec le compte créé

3. **Créer un profil professeur** :
   - Cliquer sur l'icône "Mon espace professeur" dans le header
   - Ou aller directement sur `http://localhost:4200/professeur/profil/nouveau`
   - Remplir le formulaire et créer le profil

4. **Se connecter en admin** :
   - Se déconnecter
   - Se connecter avec `admin@educonnect.fr` / `admin123`

5. **Valider le professeur** :
   - Aller sur `http://localhost:4200/admin`
   - Cliquer sur "Gérer les professeurs"
   - Approuver le professeur créé

6. **Vérifier l'affichage public** :
   - Se déconnecter
   - Aller sur `http://localhost:4200/professeurs`
   - Le professeur approuvé devrait apparaître

### B. Test API avec Postman

#### 1. Inscription
```
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "fullName": "Jean Dupont",
  "email": "jean@example.com",
  "password": "password123"
}
```

#### 2. Connexion
```
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "jean@example.com",
  "password": "password123"
}
```

**Copier le token** de la réponse.

#### 3. Créer un profil professeur
```
POST http://localhost:8000/api/professor/profile
Authorization: Bearer VOTRE_TOKEN
Content-Type: application/json

{
  "nom": "Jean Dupont",
  "matiere": "Maths",
  "niveauEnseigne": "Collège, Lycée",
  "prixParHeure": 25,
  "ville": "Paris",
  "coursEnLigne": true,
  "anneesExperience": 5,
  "descriptionCourte": "Professeur de mathématiques expérimenté"
}
```

#### 4. Connexion Admin
```
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "admin@educonnect.fr",
  "password": "admin123"
}
```

**Copier le token admin**.

#### 5. Dashboard Admin
```
GET http://localhost:8000/api/admin/dashboard
Authorization: Bearer TOKEN_ADMIN
```

#### 6. Liste des professeurs (Admin)
```
GET http://localhost:8000/api/admin/teachers?statut=pending
Authorization: Bearer TOKEN_ADMIN
```

#### 7. Approuver un professeur
```
PUT http://localhost:8000/api/admin/teachers/1/approve
Authorization: Bearer TOKEN_ADMIN
```

#### 8. Liste publique (sans token)
```
GET http://localhost:8000/api/teachers
```

## 📋 Checklist rapide

- [ ] Backend démarré sur `http://localhost:8000`
- [ ] Frontend démarré sur `http://localhost:4200`
- [ ] Admin créé avec `php create_admin.php`
- [ ] Compte utilisateur créé via l'inscription
- [ ] Profil professeur créé
- [ ] Professeur approuvé par l'admin
- [ ] Professeur visible dans la liste publique

## 🔗 URLs importantes

- **Frontend** : http://localhost:4200
- **Backend API** : http://localhost:8000/api
- **Inscription** : http://localhost:4200/inscription
- **Connexion** : http://localhost:4200/connexion
- **Espace Professeur** : http://localhost:4200/professeur/profil
- **Back Office** : http://localhost:4200/admin

## ⚠️ Problèmes courants

**Erreur CORS** : Vérifier que le backend est bien démarré et que CORS est configuré

**Erreur 401** : Vérifier que le token est bien envoyé dans les headers

**Erreur 403** : Vérifier que l'utilisateur a le bon rôle (ROLE_ADMIN pour le back office)

**Professeur n'apparaît pas** : Vérifier que le statut est "approved" dans la base de données

