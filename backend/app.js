//Importation de package
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();


//Connexion à la base de donnée MongoDB
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_LINK}?retryWrites=true&w=majority`,
    { useNewUrlParser: true,
     useUnifiedTopology: true
    })
    .then(() => console.log('Bienvenue sur MongoDB !'))
    .catch(() => console.log('Echec de connexion à MongoDB...'));


//Mise en place de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


//Gestion des images en static
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(express.json()) 


//Gestion des routes User et Sauce
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


//Exportation de l'application
module.exports = app; 