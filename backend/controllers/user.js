//Importation de User
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


//Gerer le signup
exports.signup = (req, res, next) => {
    //hashage du mot de passe 
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            
            
//Sauvegarder de User à la base de données
            user.save()
                .then(() => res.status(201).json({ message: "L'utilisateur à bien été créé !" }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


//Gerer le login
exports.login = (req, res) => {
    User
        .findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "L'utilisateur n'a pas été trouvé !" });
            }


//Vérification du mot de passe
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Le mot de passe est incorrect !' });
                    }


//Création du token
                    let token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, { expiresIn: '24h' });
                    res.status(200).json({ userId: user._id, token });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};