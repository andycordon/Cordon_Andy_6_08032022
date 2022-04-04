//Authentification de la requete
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {


//Récupération du token dans le headers.authorization
    const token = req.headers.authorization.split(' ')[1];


//Vérification du token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Utilisateur invalide...';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Mauvaise authentification...')
    });
  }
};