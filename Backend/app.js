require('dotenv').config();
const express = require("express");
const path = require("path");
const connectDB = require("./src/config/db");
const { consoleLogger, requestLogger } = require('./src/utils/logger');
const { errorHandler, notFoundHandler } = require('./src/middlewares/errorMiddleware');


const authRoutes = require("./src/routes/authRoutes");
const postRoutes = require("./src/routes/postRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();

// Ne connecter à la DB que si on n'est pas en mode test
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(consoleLogger);
app.use(requestLogger);

// Servir les images statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', async (req, res)=>{
    res.json({message:'Welcome to PPsoftKill Api'});
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

// Ne démarrer le serveur que si on n'est pas en mode test
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT,()=>{
        console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
}

module.exports = app;

