//Importation de multer
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {


//Remplace les espaces du nom du fichier de base par des underscors
    const name = file.originalname.split(' ').join('_');


//Remplace l'extension de base
    const extension = MIME_TYPES[file.mimetype]; 
    callback(null, name + Date.now() + '.' + extension);
  }
});


//Exportation de multer
module.exports = multer({ storage }).single('image');