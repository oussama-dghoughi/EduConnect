# 🧪 Guide de Test Simple

## Étape 1 : Créer l'admin

```bash
cd backend
php bin/console app:create-admin
```

**Identifiants** :
- Email: `admin@educonnect.fr`
- Password: `admin123`

## Étape 2 : Démarrer les serveurs

**Terminal 1 - Backend** :
```bash
cd backend
symfony server:start
```

**Terminal 2 - Frontend** :
```bash
ng serve
```

## Étape 3 : Test rapide (5 minutes)

### 1. Créer un compte utilisateur
- Aller sur http://localhost:4200/inscription
- Créer un compte (ex: `jean@example.com` / `password123`)

### 2. Créer un profil professeur
- Se connecter avec le compte créé
- Cliquer sur l'icône "Mon espace professeur" dans le header
- Ou aller sur http://localhost:4200/professeur/profil/nouveau
- Remplir le formulaire et créer le profil

### 3. Se connecter en admin
- Se déconnecter
- Se connecter avec `admin@educonnect.fr` / `admin123`

### 4. Valider le professeur
- Aller sur http://localhost:4200/admin
- Cliquer sur "Gérer les professeurs"
- Approuver le professeur créé

### 5. Vérifier
- Se déconnecter
- Aller sur http://localhost:4200/professeurs
- Le professeur devrait apparaître dans la liste

## ✅ C'est tout !

Pour plus de détails, voir `TESTING_GUIDE.md` ou `QUICK_START.md`

