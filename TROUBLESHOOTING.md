# Guide de dépannage - Erreurs d'inscription/connexion

## ✅ Corrections apportées

1. **Configuration CORS** : Ajout du bundle CORS pour permettre les requêtes depuis Angular
2. **Gestion des erreurs améliorée** : Messages d'erreur plus clairs et détaillés
3. **Validation du téléphone** : Le champ téléphone vide n'est plus envoyé au backend

## 🔍 Vérifications à faire

### 1. Vérifier que le backend est démarré

```bash
cd backend
symfony server:start
# ou
php -S localhost:8000 -t public
```

Le backend doit être accessible sur `http://localhost:8000`

### 2. Vérifier la connexion à la base de données

```bash
cd backend
php bin/console doctrine:schema:validate
```

Vous devriez voir : `[OK] The database schema is in sync with the mapping files.`

### 3. Vérifier les logs du backend

Si le backend est démarré avec Symfony CLI, les erreurs apparaissent dans le terminal.

### 4. Vérifier la console du navigateur

Ouvrez les outils de développement (F12) et regardez l'onglet Console et Network pour voir les erreurs détaillées.

## 🐛 Erreurs courantes

### "Impossible de se connecter au serveur"
- **Cause** : Le backend n'est pas démarré
- **Solution** : Démarrer le backend avec `symfony server:start` ou `php -S localhost:8000 -t public`

### "Un compte utilise déjà cet email"
- **Cause** : L'email est déjà enregistré
- **Solution** : Utiliser un autre email ou vous connecter avec cet email

### "Validation failed"
- **Cause** : Les données du formulaire ne respectent pas les règles de validation
- **Solution** : Vérifier que :
  - Le nom complet fait au moins 3 caractères
  - L'email est valide
  - Le mot de passe fait au moins 8 caractères
  - Les mots de passe correspondent (inscription)

### Erreur CORS
- **Cause** : Le backend bloque les requêtes depuis Angular
- **Solution** : Vérifier que `nelmio_cors.yaml` est bien configuré (déjà fait)

## 🧪 Tester l'API directement

Vous pouvez tester l'API avec curl :

```bash
# Test d'inscription
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Test de connexion
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📝 Format de réponse attendu

**Succès (201 pour register, 200 pour login) :**
```json
{
  "message": "Compte créé avec succès",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "fullName": "Test User",
    "roles": ["ROLE_USER"]
  }
}
```

**Erreur (400, 401, 409, etc.) :**
```json
{
  "message": "Un compte utilise déjà cet email."
}
```

ou

```json
{
  "message": "Validation failed",
  "errors": ["Le nom complet est requis.", "L'email est requis."]
}
```

