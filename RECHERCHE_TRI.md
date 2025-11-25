# Recherche et Tri - Fonctionnement

## 🔍 Recherche

### Côté Backend (API)
- **Endpoint** : `GET /api/teachers`
- **Filtres exacts** : Matière, Ville, Cours en ligne
- **Logique** : Requête SQL avec `WHERE` clauses
```sql
SELECT * FROM teacher 
WHERE statut = 'approved'
  AND matiere = 'Maths'        -- Filtre exact
  AND ville = 'Paris'          -- Filtre exact
  AND cours_en_ligne = true   -- Boolean
```

### Côté Frontend
- **Recherche textuelle** : Dans nom, matière, ville, description
- **Méthode** : `includes()` JavaScript (correspondance partielle)
- **Exemple** : Recherche "math" trouve "Maths", "Mathématiques"
```javascript
teachers.filter(t => 
  t.nom.toLowerCase().includes(query) ||
  t.matiere.toLowerCase().includes(query)
)
```

### Filtrage Prix
- **Côté client** : Après récupération des données
- **Logique** : `prixParHeure >= prixMin && prixParHeure <= prixMax`

---

## 📊 Tri

### Options Disponibles
1. **Par défaut** : Date de création (plus récent en premier)
2. **Prix croissant** : Du moins cher au plus cher
3. **Prix décroissant** : Du plus cher au moins cher
4. **Note** : De la meilleure note à la plus basse
5. **Expérience** : Du plus expérimenté au moins expérimenté

### Implémentation
- **Backend** : Tri par date uniquement (`ORDER BY created_at DESC`)
- **Frontend** : Tri des autres critères avec `sort()`
```javascript
// Tri par prix croissant
teachers.sort((a, b) => a.prixParHeure - b.prixParHeure)

// Tri par note décroissante
teachers.sort((a, b) => b.noteMoyenne - a.noteMoyenne)
```

---

## 🔄 Flux Complet

1. **Utilisateur** : Saisit recherche + applique filtres
2. **Frontend** : Envoie requête API avec filtres backend (matière, ville)
3. **Backend** : Retourne résultats filtrés (statut=approved uniquement)
4. **Frontend** : 
   - Applique recherche textuelle
   - Filtre par prix
   - Trie selon option choisie
5. **Affichage** : Résultats finaux à l'utilisateur

---

## ⚡ Performance

- **Filtres backend** : Réduisent le nombre de résultats dès la requête SQL
- **Recherche frontend** : Rapide pour < 1000 résultats
- **Amélioration future** : Recherche full-text PostgreSQL (tsvector) pour grandes quantités

