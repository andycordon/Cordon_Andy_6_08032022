//Importation de sauce
const Sauce = require('../models/sauce');
const fs = require('fs');

//Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).json(sauces);
        })
        .catch(error => {
            res.status(400).json({ error });          
    });

};


//Récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
};


//Création de la sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauces);
    delete sauceObject._id;
    let sauce = new Sauce({
        userId: req.token.userId,
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });


//Sauvegarde de la sauce dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'La sauce a été ajouté' }))
        .catch(error => res.status(400).json({ error }));
};


//Départ de modification de la sauce
exports.updateSauce = (req, res, next) => {
    Sauce
        .findOne({ _id: req.params.id })
        .then(sauce => {


//Vérifier que l'utilisateur est autorisé à modifier
            if (sauce.userId !== req.token.userId) {
                return res.status(401).json({ error });
            }


//Récupérer et supprimer l'image de la sauce du serveur avant sa modification
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) throw 'error';
                });
            }


//Modification de la Sauce, avec ou sans image
            const sauceObject = req.file ?
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };


//Mise à jour de la base de donnée
            Sauce
                .updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'La sauce a été modifié !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
}


//Départ de supprimer la sauce
exports.deleteSauce = (req, res, next) => {
    Sauce
        .findOne({ _id: req.params.id })
        .then(sauce => {


//Vérifier que l'utilisateur est autorisé à modifier
            if (sauce.userId === req.token.userId) {
                const filename = sauce.imageUrl.split('/images/')[1];


//Récupérer et supprimer l'image de la sauce du serveur
                fs.unlink(`images/${filename}`, () => {


//supprime la sauce
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'La sauce a été supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
                });
            } else {
                return res.status(400).json({ message: "Vous n'êtes pas autorisé à faire ceci..." })
            }
        })
        .catch(error => res.status(500).json({ error }));
};


//Départ des Likes Dislikes et retour neutre
exports.userLike = (req, res, next) => {      
    const userId = req.body.userId;
    const like = req.body.like;

    Sauce
        .findOne({ _id: req.params.id })
        .then(sauce => {


//Vérifier que l'utilisateur est autorisé à modifier
            if (userId !== req.token.userId) {
                return res.status(401).json({ error });
            }


//Ajout d'un like
            if (like === 1 && !sauce.usersLiked.includes(userId)) {
                Sauce
                    .updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: 1 },
                            $push: { usersLiked: userId },
                            _id: req.params.id
                        })
                    .then(() => res.status(200).json({ message: "J'aime cette sauce !" }))
                    .catch(error => res.status(400).json({ error }));

                    
//Ajout d'un Dislike
            } else if (like === -1 && !sauce.usersLiked.includes(userId)) {
                Sauce
                    .updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: userId },
                            _id: req.params.id
                        })
                    .then(() => res.status(200).json({ message: "Je n'aime pas cette sauce..." }))
                    .catch(error => res.status(400).json({ error }));

//Passer de Like à neutre
            } else if (like === 0 && sauce.usersLiked.includes(userId)) {
                Sauce
                    .updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: userId },
                            _id: req.params.id
                        })
                    .then(() => res.status(200).json({ message: "Je n'ai pas d'avis sur cette sauce." }))
                    .catch(error => res.status(400).json({ error }));


//Passer de Dislike à neutre
            } else if (like === 0 && sauce.usersDisliked.includes(userId)) {
                Sauce
                    .updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId },
                            _id: req.params.id
                        })
                    .then(() => res.status(200).json({ message: "Je n'ai pas d'avis sur cette sauce."}))
                    .catch(error => res.status(400).json({ error }));

            } else {
                return res.status(400).json({ error })
            }
        })
        .catch(error => res.status(500).json({ error }));
};