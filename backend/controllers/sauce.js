//Importation de sauce
const Sauce = require('../models/sauce');
const fs = require('fs');


//Récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


//Récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
};


//Création de la sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
    sauce.save()
        .then(() => res.status(201).json({ message: 'La sauce a été ajouté !'}))
        .catch(error => res.status(400).json({ error }));
};


//Modification de la Sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
      {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'La sauce a été modifié !'}))
      .catch(error => res.status(400).json({ error }));
};
  
//Supprime la sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'La sauce a été supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
        })
        .catch(error => res.status(500).json({ error }));
};
  


//Likes Dislikes et retour neutre
exports.likeSauce = (req, res, next) => {
    if (req.body.like === 1) {
        Sauce.updateOne( {_id:req.params.id}, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } })
            .then(() => res.status(200).json({ message: "J'aime cette sauce !"}))
            .catch(error => res.status(400).json({ error }));
    } else if (req.body.like === -1) {  // Je n'aime pas
        Sauce.updateOne( {_id:req.params.id}, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } })
            .then(() => res.status(200).json({ message: "Je n'aime pas cette sauce..."}))
            .catch(error => res.status(400).json({ error }));
    } else {  // Je n'ai plus d'avis
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
            if (sauce.usersLiked.includes(req.body.userId)) {
                Sauce.updateOne( {_id:req.params.id}, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                .then(() => res.status(200).json({ message: "Je n'ai plus d'avis sur cette sauce."}))
                .catch(error => res.status(400).json({ error }))
            } else if (sauce.usersDisliked.includes(req.body.userId)) {
                Sauce.updateOne( {_id:req.params.id}, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                .then(() => res.status(200).json({ message: "Je n'ai plus d'avis sur cette sauce."}))
                .catch(error => res.status(400).json({ error }))
            }
            })
            .catch(error => res.status(400).json({ error }));
    }
};