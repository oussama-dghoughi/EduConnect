# Backend EduConnect - Symfony

Backend API pour la plateforme EduConnect développé avec Symfony 7.

## 📋 Prérequis

- PHP 8.2 ou supérieur
- Composer
- PostgreSQL 12 ou supérieur
- Symfony CLI (optionnel mais recommandé)

## 🚀 Installation

1. **Installer les dépendances**
```bash
composer install
```

2. **Configurer la base de données**

Modifier le fichier `.env` avec vos identifiants PostgreSQL :
```env
DATABASE_URL="postgresql://username:password@127.0.0.1:5432/educonnect?serverVersion=16&charset=utf8"
```

3. **Créer la base de données**

Option 1 : Via PostgreSQL directement
```sql
CREATE DATABASE educonnect;
```

Option 2 : Via Symfony
```bash
php bin/console doctrine:database:create
```

4. **Exécuter les migrations**
```bash
php bin/console doctrine:migrations:migrate
```

## 🏃 Lancer le serveur

```bash
# Avec Symfony CLI
symfony server:start

# Ou avec PHP built-in server
php -S localhost:8000 -t public
```

Le serveur sera accessible sur `http://localhost:8000`

## 📡 API Endpoints

### Authentification

- **POST** `/api/auth/register` - Inscription
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "fullName": "John Doe",
    "phone": "0123456789"
  }
  ```

- **POST** `/api/auth/login` - Connexion
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/refresh` - Rafraîchir le token (nécessite un token valide)

## 🔧 Configuration

### Variables d'environnement (.env)

- `DATABASE_URL` : URL de connexion MySQL
- `JWT_SECRET` : Clé secrète pour signer les tokens JWT
- `JWT_TTL` : Durée de vie du token en secondes (défaut: 3600)

## 📁 Structure du projet

```
backend/
├── config/          # Configuration Symfony
├── migrations/      # Migrations Doctrine
├── public/          # Point d'entrée public
├── src/
│   ├── Controller/  # Contrôleurs API
│   ├── Entity/      # Entités Doctrine
│   ├── Repository/  # Repositories
│   └── Service/      # Services métier
└── var/             # Cache, logs, etc.
```

## 🗄️ Base de données

La base de données MySQL `educonnect` contient :

- **user** : Table des utilisateurs (email, password, full_name, phone, roles, etc.)

## 🔐 Sécurité

- Mots de passe hashés avec bcrypt
- JWT pour l'authentification
- Validation des données avec Symfony Validator
- CORS configuré pour le frontend Angular

## 📝 Commandes utiles

```bash
# Créer une nouvelle entité
php bin/console make:entity

# Créer une migration
php bin/console make:migration

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Vider le cache
php bin/console cache:clear

# Créer un utilisateur de test
php bin/console app:create-user email@example.com password
```

## 🧪 Tests

```bash
php bin/phpunit
```

## 📚 Documentation

- [Documentation Symfony](https://symfony.com/doc/current/index.html)
- [Doctrine ORM](https://www.doctrine-project.org/projects/doctrine-orm/en/latest/index.html)

