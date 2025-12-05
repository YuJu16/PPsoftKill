# 📚 Documentation API - Guide pour Développeurs Frontend

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration](#configuration)
3. [Authentification](#authentification)
4. [Endpoints](#endpoints)
   - [Authentification](#endpoints-authentification)
   - [Posts](#endpoints-posts)
   - [Votes](#endpoints-votes)
   - [Commentaires](#endpoints-commentaires)
   - [Administration](#endpoints-administration)
5. [Structure des données](#structure-des-données)
6. [Gestion des erreurs](#gestion-des-erreurs)
7. [Upload d'images](#upload-dimages)
8. [Exemples de code](#exemples-de-code)
9. [Bonnes pratiques](#bonnes-pratiques)

---

## 🎯 Vue d'ensemble

Cette API REST permet de gérer un système de posts avec :
- ✅ Authentification utilisateur (JWT)
- ✅ Création et gestion de posts avec images
- ✅ Système de votes (hot/cold)
- ✅ Commentaires
- ✅ Recherche et pagination
- ✅ Modération des posts

**Base URL :** `http://localhost:8080/api`

**Format des données :** JSON

**Authentification :** JWT Bearer Token

---

## ⚙️ Configuration

### Variables d'environnement

Pour le développement, assurez-vous que le backend est configuré avec :

```env
MONGODB_URL=mongodb://localhost:27017/votre_base
JWT_SECRET=votre_secret_jwt
PORT=8080
```

### Headers requis

Pour les requêtes authentifiées, incluez le token JWT :

```
Authorization: Bearer <votre_token_jwt>
Content-Type: application/json
```

---

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Flux d'authentification

1. **Inscription** → Récupérer le token
2. **Connexion** → Récupérer le token
3. **Stocker le token** dans le localStorage/sessionStorage
4. **Inclure le token** dans chaque requête authentifiée

### Stockage du token (exemple)

```javascript
// Après connexion/inscription
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// Pour les requêtes
const token = localStorage.getItem('token');
```

---

## 📡 Endpoints

### 🔑 Endpoints Authentification

#### POST `/api/auth/register`

Inscrire un nouvel utilisateur.

**Requête :**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

**Réponse 201 :**
```json
{
  "message": "User saved successfully",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs possibles :**
- `400` : Champs manquants ou invalides
- `409` : Email ou username déjà utilisé

---

#### POST `/api/auth/login`

Connexion d'un utilisateur existant.

**Requête :**
```json
{
  "username": "john@example.com",
  "password": "Password123!"
}
```

> **Note :** Le champ `username` peut être soit l'email, soit le nom d'utilisateur.

**Réponse 200 :**
```json
{
  "success": true,
  "message": "login successfull",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "bio": null,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Erreurs possibles :**
- `400` : Email/mot de passe incorrect ou champs manquants

---

#### GET `/api/auth/me`

Récupérer le profil de l'utilisateur connecté.

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse 200 :**
```json
{
  "success": true,
  "message": "Your profile",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "john_doe",
    "email": "john@example.com",
    "bio": null,
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 📝 Endpoints Posts

#### GET `/api/posts`

Récupérer la liste des posts approuvés (paginée).

**Query parameters :**
- `page` (optionnel) : Numéro de page (défaut: 1)

**Headers :**
- Authentification optionnelle (pour voir tous les posts si admin)

**Réponse 200 :**
```json
{
  "success": true,
  "posts": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Super Promo iPhone",
      "description": "Description du produit...",
      "price": 29.99,
      "originalPrice": 49.99,
      "url": "https://example.com",
      "image": "post-1234567890-123456789.jpg",
      "category": "High-Tech",
      "status": "approved",
      "temperature": 15,
      "authorId": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalPosts": 50,
  "totalPages": 5
}
```

---

#### GET `/api/posts/search?q=recherche`

Rechercher des posts par titre ou description.

**Query parameters :**
- `q` (requis) : Terme de recherche

**Réponse 200 :**
```json
{
  "success": "true",
  "posts": [
    {
      "_id": "...",
      "title": "...",
      "description": "...",
      ...
    }
  ]
}
```

---

#### GET `/api/posts/:id`

Récupérer un post par son ID.

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse 200 :**
```json
{
  "success": true,
  "message": "post found successfully",
  "post": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "...",
    "description": "...",
    ...
  }
}
```

**Erreurs possibles :**
- `400` : ID invalide
- `404` : Post non trouvé

---

#### POST `/api/posts`

Créer un nouveau post.

**Headers requis :**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (FormData) :**
```javascript
const formData = new FormData();
formData.append('title', 'Titre du post');
formData.append('description', 'Description détaillée...');
formData.append('price', '29.99');
formData.append('originalPrice', '49.99');
formData.append('url', 'https://example.com');
formData.append('category', 'High-Tech');
formData.append('image', fileInput.files[0]); // Optionnel
```

**Champs :**
- `title` (requis) : 5-100 caractères
- `description` (requis) : 10-500 caractères
- `price` (optionnel) : Nombre >= 0
- `originalPrice` (optionnel) : Nombre >= 0
- `url` (optionnel) : URL valide (max 2048 caractères)
- `category` (optionnel) : Voir [Catégories](#catégories)
- `image` (optionnel) : Fichier image (jpeg, jpg, png, gif, webp, max 5MB)

**Réponse 201 :**
```json
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Titre du post",
    "description": "Description détaillée...",
    "price": 29.99,
    "originalPrice": 49.99,
    "url": "https://example.com",
    "image": "post-1234567890-123456789.jpg",
    "category": "High-Tech",
    "status": "pending",
    "temperature": 0,
    "authorId": {...},
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Catégories disponibles :**
- `High-Tech`
- `Maison`
- `Mode`
- `Loisirs`
- `Autre` (par défaut)

---

#### PUT `/api/posts/:id`

Modifier un post existant.

**Headers requis :**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (FormData) :** Tous les champs sont optionnels (seuls ceux à modifier)

**Réponse 200 :**
```json
{
  "success": true,
  "message": "post modified successfully",
  "post": {...}
}
```

**Erreurs possibles :**
- `403` : Pas autorisé ou post déjà approuvé
- `404` : Post non trouvé

---

#### DELETE `/api/posts/:id`

Supprimer un post.

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse 200 :**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

**Erreurs possibles :**
- `403` : Pas autorisé (seul l'auteur ou un admin peut supprimer)

---

### 👍 Endpoints Votes

#### POST `/api/posts/:id/vote`

Voter pour un post (hot ou cold).

**Headers requis :**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body :**
```json
{
  "type": "hot"
}
```

**Types de vote :**
- `hot` : Vote positif (augmente la température)
- `cold` : Vote négatif (diminue la température)

**Réponse 200 :**
```json
{
  "success": true,
  "message": "voted successfully",
  "vote": {
    "_id": "...",
    "type": "hot",
    "userId": "...",
    "postId": "...",
    "createdAt": "..."
  }
}
```

> **Note :** Si l'utilisateur a déjà voté, le vote sera mis à jour.

---

#### DELETE `/api/posts/:id/vote`

Retirer son vote d'un post.

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse 200 :**
```json
{
  "success": true,
  "message": "vote removed successfully"
}
```

---

### 💬 Endpoints Commentaires

#### GET `/api/posts/:postId/comments`

Récupérer les commentaires d'un post.

**Réponse 200 :**
```json
{
  "success": true,
  "message": "list of comments",
  "comments": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "content": "Super article !",
      "postId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "authorId": {
        "username": "john_doe"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### POST `/api/posts/:postId/comments`

Ajouter un commentaire à un post.

**Headers requis :**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body :**
```json
{
  "content": "Super article !"
}
```

**Validation :**
- `content` : 3-350 caractères

**Réponse 201 :**
```json
{
  "success": true,
  "message": "comment added successfully",
  "comment": {
    "_id": "...",
    "content": "Super article !",
    "postId": "...",
    "authorId": {
      "username": "john_doe"
    },
    "createdAt": "..."
  }
}
```

---

#### PUT `/api/comments/:id`

Modifier un commentaire.

**Headers requis :**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body :**
```json
{
  "content": "Commentaire modifié"
}
```

**Réponse 200 :**
```json
{
  "success": true,
  "message": "comment modified successfully",
  "comment": {...}
}
```

---

#### DELETE `/api/comments/:id`

Supprimer un commentaire.

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse 200 :**
```json
{
  "success": true,
  "message": "comment deleted successfully"
}
```

---

### 🛡️ Endpoints Administration

> **Note :** Réservés aux utilisateurs avec le rôle `admin` ou `moderator`.

#### GET `/api/admin/posts/pending`

Récupérer la liste des posts en attente de modération.

**Headers requis :**
```
Authorization: Bearer <token>
```

**Réponse 200 :**
```json
{
  "success": true,
  "message": "list of pending posts",
  "posts": [...]
}
```

---

#### PATCH `/api/admin/posts/:id/moderate`

Modérer un post (approuver ou rejeter).

**Headers requis :**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body :**
```json
{
  "status": "approved"
}
```

**Statuts possibles :**
- `approved` : Approuver le post
- `rejected` : Rejeter le post

**Réponse 200 :**
```json
{
  "success": true,
  "message": "post moderated successfully",
  "post": {...}
}
```

---

## 📊 Structure des données

### Modèle Post

```typescript
interface Post {
  _id: string;
  title: string;              // 5-100 caractères
  description: string;        // 10-500 caractères
  price: number;              // >= 0
  originalPrice: number;      // >= 0
  url?: string;               // Max 2048 caractères
  image?: string;             // Nom du fichier image
  category: string;           // High-Tech | Maison | Mode | Loisirs | Autre
  status: string;             // pending | approved | rejected
  temperature: number;        // Score de popularité
  authorId: User | string;    // Référence à l'utilisateur
  createdAt: Date;
  updatedAt: Date;
}
```

### Modèle User

```typescript
interface User {
  _id: string;
  username: string;           // 3-30 caractères, unique
  email: string;              // Email valide, unique
  role: string;               // user | moderator | admin
  bio?: string;               // Max 100 caractères
  createdAt: Date;
  updatedAt: Date;
}
```

### Modèle Comment

```typescript
interface Comment {
  _id: string;
  content: string;            // 3-350 caractères
  postId: string;             // Référence au post
  authorId: User | string;    // Référence à l'utilisateur
  createdAt: Date;
  updatedAt: Date;
}
```

### Modèle Vote

```typescript
interface Vote {
  _id: string;
  type: "hot" | "cold";
  userId: string;             // Référence à l'utilisateur
  postId: string;             // Référence au post
  createdAt: Date;
  updatedAt: Date;
}
```

---

## ⚠️ Gestion des erreurs

L'API retourne des erreurs au format JSON :

```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [...]  // Optionnel : détails de validation
}
```

### Codes HTTP

- `200` : Succès
- `201` : Ressource créée avec succès
- `400` : Requête invalide (validation, champs manquants)
- `401` : Non authentifié (token manquant ou invalide)
- `403` : Non autorisé (permissions insuffisantes)
- `404` : Ressource non trouvée
- `409` : Conflit (ex: email déjà utilisé)
- `500` : Erreur serveur

### Exemples d'erreurs

**400 - Validation :**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title size must be between 5 & 100 chars"
    }
  ]
}
```

**401 - Non authentifié :**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**403 - Non autorisé :**
```json
{
  "success": false,
  "message": "You are not allowed to modify this post"
}
```

---

## 🖼️ Upload d'images

### Configuration

- **Formats acceptés :** JPEG, JPG, PNG, GIF, WEBP
- **Taille maximale :** 5 MB
- **Nom du champ :** `image` (FormData)

### URL des images

Les images sont servies via :
```
http://localhost:8080/uploads/<nom_du_fichier>
```

Exemple :
```
http://localhost:8080/uploads/post-1234567890-123456789.jpg
```

### Exemple d'upload

```javascript
const formData = new FormData();
formData.append('title', 'Mon post');
formData.append('description', 'Description...');
formData.append('image', fileInput.files[0]);

const response = await fetch('http://localhost:8080/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

## 💻 Exemples de code

### Configuration Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Authentification

```javascript
// Connexion
const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', {
      username,
      password
    });
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    console.error('Erreur de connexion:', error.response?.data);
    throw error;
  }
};

// Inscription
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      confirmPassword: userData.confirmPassword
    });
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  } catch (error) {
    console.error('Erreur d\'inscription:', error.response?.data);
    throw error;
  }
};
```

### Gestion des Posts

```javascript
// Récupérer les posts
const getPosts = async (page = 1) => {
  try {
    const response = await api.get(`/posts?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    throw error;
  }
};

// Créer un post
const createPost = async (postData, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('description', postData.description);
    formData.append('price', postData.price || 0);
    formData.append('originalPrice', postData.originalPrice || 0);
    formData.append('category', postData.category || 'Autre');
    
    if (postData.url) formData.append('url', postData.url);
    if (imageFile) formData.append('image', imageFile);
    
    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    throw error;
  }
};

// Voter pour un post
const votePost = async (postId, type) => {
  try {
    const response = await api.post(`/posts/${postId}/vote`, {
      type: type // 'hot' ou 'cold'
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du vote:', error);
    throw error;
  }
};

// Rechercher des posts
const searchPosts = async (query) => {
  try {
    const response = await api.get(`/posts/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    throw error;
  }
};
```

### Gestion des Commentaires

```javascript
// Ajouter un commentaire
const addComment = async (postId, content) => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, {
      content
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
    throw error;
  }
};

// Récupérer les commentaires
const getComments = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des commentaires:', error);
    throw error;
  }
};
```

### Exemple avec Fetch API

```javascript
// Récupérer les posts
const getPosts = async (page = 1) => {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`http://localhost:8080/api/posts?page=${page}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la récupération');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur:', error);
    throw error;
  }
};
```

---

## ✅ Bonnes pratiques

### 1. Gestion du token

```javascript
// Vérifier si l'utilisateur est connecté
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Déconnexion
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Rediriger vers la page de connexion
};

// Vérifier l'expiration du token (à implémenter côté backend)
```

### 2. Gestion des erreurs

```javascript
// Wrapper pour gérer les erreurs
const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Token expiré ou invalide
        logout();
        // Rediriger vers la page de connexion
        break;
      case 403:
        // Accès refusé
        alert('Vous n\'avez pas les permissions nécessaires');
        break;
      case 404:
        // Ressource non trouvée
        alert('Ressource non trouvée');
        break;
      default:
        alert(data.message || 'Une erreur est survenue');
    }
  } else if (error.request) {
    // Requête envoyée mais pas de réponse
    alert('Impossible de joindre le serveur');
  } else {
    // Erreur lors de la configuration de la requête
    alert('Erreur de configuration de la requête');
  }
};
```

### 3. Format des URLs d'images

```javascript
// Helper pour construire l'URL complète d'une image
const getImageUrl = (imageFilename) => {
  if (!imageFilename) return null;
  return `http://localhost:8080/uploads/${imageFilename}`;
};

// Utilisation
<img src={getImageUrl(post.image)} alt={post.title} />
```

### 4. Pagination

```javascript
const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const loadPosts = async (page) => {
    try {
      const data = await getPosts(page);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage || page);
    } catch (error) {
      handleApiError(error);
    }
  };
  
  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);
  
  return (
    <div>
      {/* Liste des posts */}
      {posts.map(post => (
        <PostCard key={post._id} post={post} />
      ))}
      
      {/* Pagination */}
      <div className="pagination">
        <button 
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Précédent
        </button>
        <span>Page {currentPage} / {totalPages}</span>
        <button 
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};
```

### 5. Validation côté client

```javascript
// Valider avant d'envoyer
const validatePost = (postData) => {
  const errors = {};
  
  if (!postData.title || postData.title.length < 5) {
    errors.title = 'Le titre doit contenir au moins 5 caractères';
  }
  
  if (!postData.description || postData.description.length < 10) {
    errors.description = 'La description doit contenir au moins 10 caractères';
  }
  
  if (postData.price && postData.price < 0) {
    errors.price = 'Le prix doit être positif';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
```

---

## 🚀 Démarrer le développement

1. **Vérifier que le backend est démarré :**
   ```bash
   # Le serveur doit être accessible sur http://localhost:8080
   ```

2. **Configurer l'URL de base dans votre app frontend :**
   ```javascript
   const API_BASE_URL = 'http://localhost:8080/api';
   ```

3. **Tester la connexion :**
   ```javascript
   fetch('http://localhost:8080/')
     .then(res => res.json())
     .then(data => console.log(data));
   // Devrait afficher: { message: 'Welcome to PPsoftKill Api' }
   ```

---

## 📞 Support

Pour toute question ou problème :
- Vérifier les logs du serveur backend
- Vérifier la console du navigateur pour les erreurs réseau
- S'assurer que MongoDB est bien connecté côté backend

---

**Bon développement ! 🎉**

