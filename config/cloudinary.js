// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

try {
  // Initialize Cloudinary SDK with your Cloudinary credentials
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });
} catch (error) {
  console.error("Error initializing Cloudinary:", error);
}

module.exports = cloudinary;
