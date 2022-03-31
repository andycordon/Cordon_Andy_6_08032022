//Authentification de la requete
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {

//Récupération du token dans le headers.authorization
    const token = req.headers.authorization.split(' ')[1];

//Vérification du token
    req.token = jwt.verify(token, process.env.TOKEN_KEY);
    
    if (req.body.userId && req.body.userId !== req.token.userId) {
      throw 'Utilisateur invalide...';
    } else {
      next();
    }
  } catch {
    res.status(403).json({ error:'Mauvaise authentification...'});
  }
};