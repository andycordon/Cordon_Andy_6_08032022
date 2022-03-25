//Schéma de donné pour User

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({


//Faire en sorte de ne pas s'incrire plusieurs fois avec le même email 
    email: { type: String, required: true, unique: true },
    password: { type: String, require: true }
});


//Ajout du plugin pour renforcé la sécurité sur le fait de plusieurs insciption avec le même email
userSchema.plugin(uniqueValidator); 


//Exportation du schéma User
module.exports = mongoose.model('User', userSchema); 