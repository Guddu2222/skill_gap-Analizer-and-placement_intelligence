const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud_name',
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_api_secret'
});

// Configure Multer Storage for Resumes
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'resumes',
    allowed_formats: ['pdf', 'doc', 'docx'],
    resource_type: 'auto'
  }
});

// Configure Multer Storage for Images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_pictures',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image'
  }
});

// Create Multer instances
const upload = multer({ storage: storage });
const uploadImage = multer({ storage: imageStorage });

module.exports = { cloudinary, upload, uploadImage };
