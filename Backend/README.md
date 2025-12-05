# 🚀 PPsoftKill Backend API

API REST pour la gestion de posts avec système de votes et commentaires.

## 📚 Documentation

- **[Documentation Frontend](./README_FRONTEND.md)** - Guide complet pour les développeurs frontend
- **[Documentation Tests](./README_TESTS.md)** - Guide pour l'exécution des tests

## 🛠️ Installation

```bash
npm install
```

## ⚙️ Configuration

Créez un fichier `.env` à la racine du projet :

```env
MONGODB_URL=mongodb://localhost:27017/votre_base_de_donnees
JWT_SECRET=votre_secret_jwt_securise
PORT=8080
```

## 🏃 Démarrage

```bash
npm start
```

Le serveur démarre sur `http://localhost:8080`

## 🧪 Tests

```bash
npm test
```

## 📦 Structure du projet

```
Backend/
├── src/
│   ├── config/         # Configuration (DB, etc.)
│   ├── controllers/    # Logique métier
│   ├── middlewares/    # Middlewares Express
│   ├── models/         # Modèles Mongoose
│   ├── routes/         # Routes API
│   ├── utils/          # Utilitaires
│   └── validators/     # Validations
├── tests/              # Tests API
├── uploads/            # Images uploadées
├── app.js              # Configuration Express
└── index.js            # Point d'entrée
```

## 🔑 Fonctionnalités

- ✅ Authentification JWT
- ✅ CRUD Posts avec images
- ✅ Système de votes (hot/cold)
- ✅ Commentaires
- ✅ Recherche et pagination
- ✅ Modération des posts
- ✅ Upload d'images (Multer)

## 📡 Routes principales

- `/api/auth` - Authentification
- `/api/posts` - Gestion des posts
- `/api/comments` - Gestion des commentaires
- `/api/admin` - Administration

Pour plus de détails, consultez la [Documentation Frontend](./README_FRONTEND.md).

## 🛡️ Technologies utilisées

- Node.js / Express
- MongoDB / Mongoose
- JWT pour l'authentification
- Multer pour l'upload d'images
- Jest / Supertest pour les tests

## 📝 License

ISC

