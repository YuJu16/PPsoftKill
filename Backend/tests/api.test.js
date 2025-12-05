const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

// Variables globales pour stocker les tokens et IDs
let authToken = '';
let adminToken = '';
let userId = '';
let postId = '';
let commentId = '';

// Données de test
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Test123456!',
    confirmPassword: 'Test123456!'
};

const testAdmin = {
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin123456!',
    confirmPassword: 'Admin123456!'
};

const testPost = {
    title: 'Test Post Title',
    description: 'This is a test post description with more than 10 characters',
    price: 29.99,
    originalPrice: 49.99,
    url: 'https://example.com',
    category: 'High-Tech'
};

describe('API Tests', () => {
    beforeAll(async () => {
        // Se connecter à MongoDB si pas déjà connecté
        if (mongoose.connection.readyState === 0) {
            try {
                const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/test';
                await mongoose.connect(mongoUrl);
                console.log('MongoDB connected for tests');
            } catch (error) {
                console.error('MongoDB connection error:', error.message);
            }
            // Attendre que la connexion soit établie
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    });

    afterAll(async () => {
        // Nettoyer les données de test
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.db.collection('users').deleteMany({ email: { $in: [testUser.email, testAdmin.email] } });
            await mongoose.connection.db.collection('posts').deleteMany({ title: testPost.title });
            await mongoose.connection.db.collection('comments').deleteMany({});
            await mongoose.connection.db.collection('votes').deleteMany({});
            await mongoose.connection.close();
        }
    });

    describe('Health Check', () => {
        test('GET / - Should return welcome message', async () => {
            const response = await request(app)
                .get('/')
                .expect(200);
            
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toBe('Welcome to PPsoftKill Api');
        });
    });

    describe('Authentication', () => {
        test('POST /api/auth/register - Should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser)
                .expect(201);
            
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.email).toBe(testUser.email);
            authToken = response.body.token;
        });

        test('POST /api/auth/login - Should login user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: testUser.email, // Peut être email ou username
                    password: testUser.password
                })
                .expect(200);
            
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            authToken = response.body.token;
        });

        test('POST /api/auth/register - Should fail with duplicate email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(testUser)
                .expect(409);
            
            expect(response.body).toHaveProperty('message');
        });
    });

    describe('Posts', () => {
        test('GET /api/posts - Should get list of posts', async () => {
            const response = await request(app)
                .get('/api/posts')
                .expect(200);
            
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('posts');
            expect(Array.isArray(response.body.posts)).toBe(true);
        });

        test('POST /api/posts - Should create a new post', async () => {
            const response = await request(app)
                .post('/api/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testPost)
                .expect(201);
            
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('post');
            expect(response.body.post.title).toBe(testPost.title);
            postId = response.body.post._id;
        });

        test('GET /api/posts/:id - Should get post by ID', async () => {
            const response = await request(app)
                .get(`/api/posts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.post._id).toBe(postId);
        });

        test('PUT /api/posts/:id - Should update post', async () => {
            const updatedPost = {
                title: 'Updated Test Post Title',
                description: 'This is an updated test post description'
            };
            
            const response = await request(app)
                .put(`/api/posts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedPost)
                .expect(200);
            
            expect(response.body).toHaveProperty('success', true);
            expect(response.body.post.title).toBe(updatedPost.title);
        });

        test('GET /api/posts/search?q=test - Should search posts', async () => {
            const response = await request(app)
                .get('/api/posts/search?q=test')
                .expect(200);
            
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('posts');
        });
    });

    describe('Votes', () => {
        test('POST /api/posts/:id/vote - Should vote hot on post', async () => {
            const response = await request(app)
                .post(`/api/posts/${postId}/vote`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ type: 'hot' })
                .expect(200);
            
            expect(response.body).toHaveProperty('success', true);
        });

        test('DELETE /api/posts/:id/vote - Should remove vote', async () => {
            const response = await request(app)
                .delete(`/api/posts/${postId}/vote`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            
            expect(response.body).toHaveProperty('success', true);
        });

        test('POST /api/posts/:id/vote - Should vote cold on post', async () => {
            const response = await request(app)
                .post(`/api/posts/${postId}/vote`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ type: 'cold' })
                .expect(200);
            
            expect(response.body).toHaveProperty('success', true);
        });
    });

    describe('Comments', () => {
        test('POST /api/posts/:postId/comments - Should add comment', async () => {
            const comment = {
                content: 'This is a test comment'
            };
            
            const response = await request(app)
                .post(`/api/posts/${postId}/comments`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(comment)
                .expect(201);
            
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('comment');
            commentId = response.body.comment._id;
        });

        test('GET /api/posts/:postId/comments - Should get comments', async () => {
            const response = await request(app)
                .get(`/api/posts/${postId}/comments`)
                .expect(200);
            
            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('comments');
            expect(Array.isArray(response.body.comments)).toBe(true);
        });
    });

    describe('Error Handling', () => {
        test('GET /api/posts/invalid - Should return 400 for invalid ID', async () => {
            const response = await request(app)
                .get('/api/posts/invalid')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(400);
            
            expect(response.body.success).toBe(false);
        });

        test('POST /api/posts - Should return 401 without token', async () => {
            const response = await request(app)
                .post('/api/posts')
                .send(testPost)
                .expect(401);
        });

        test('PUT /api/posts/:id - Should return 403 for unauthorized user', async () => {
            // Créer un autre utilisateur
            const otherUser = {
                username: 'otheruser',
                email: 'other@example.com',
                password: 'Other123456!'
            };
            
            await request(app)
                .post('/api/auth/register')
                .send({
                    ...otherUser,
                    confirmPassword: otherUser.password
                });
            
            const loginResponse = await request(app)
                .post('/api/auth/login')
                .send({
                    username: otherUser.email,
                    password: otherUser.password
                });
            
            const otherToken = loginResponse.body.token;
            
            const response = await request(app)
                .put(`/api/posts/${postId}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send({ title: 'Unauthorized update' })
                .expect(403);
            
            expect(response.body.success).toBe(false);
        });
    });
});

