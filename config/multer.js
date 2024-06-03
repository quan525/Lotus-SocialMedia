const multer = require('multer');

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

// Initialize Multer instance with Cloudinary storage
// For single file upload
// Multer instance with configured options
const parser = multer({ storage: storage });


// For multiple file upload
 
module.exports =  parser ;
