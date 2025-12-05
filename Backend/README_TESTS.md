# Guide de Test API

## Configuration requise

1. **MongoDB** doit être installé et en cours d'exécution
2. Créer un fichier `.env` à la racine du dossier `Backend` avec :
   ```
   MONGODB_URL=mongodb://localhost:27017/votre_base_de_donnees
   JWT_SECRET=votre_secret_jwt
   PORT=8080
   ```

## Lancer le serveur

```bash
npm start
```

Le serveur démarrera sur `http://localhost:8080`

## Exécuter les tests

```bash
npm test
```

## Tests disponibles

Les tests couvrent les fonctionnalités suivantes :

### ✅ Authentification
- Inscription d'un nouvel utilisateur
- Connexion utilisateur
- Gestion des erreurs (email dupliqué)

### ✅ Posts
- Liste des posts
- Création d'un post
- Récupération d'un post par ID
- Mise à jour d'un post
- Recherche de posts

### ✅ Votes
- Voter "hot" sur un post
- Voter "cold" sur un post
- Retirer un vote

### ✅ Commentaires
- Ajouter un commentaire
- Récupérer les commentaires d'un post

### ✅ Gestion d'erreurs
- Validation des IDs invalides
- Authentification requise
- Autorisations (403)

## Structure des tests

Les tests sont organisés dans `Backend/tests/api.test.js` et utilisent :
- **Jest** comme framework de test
- **Supertest** pour tester les routes Express
- Nettoyage automatique des données de test après exécution

## Notes importantes

- Les tests créent des données de test qui sont automatiquement nettoyées après l'exécution
- Assurez-vous que MongoDB est accessible avant de lancer les tests
- Les tests nécessitent une connexion MongoDB valide

