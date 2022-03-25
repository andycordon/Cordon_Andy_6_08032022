//Configuration des routes pour User

const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup); //POST/api/auth/signup
router.post('/login', userCtrl.login); //POST/api/auth/login


//Exportation des routes pour User
module.exports = router;