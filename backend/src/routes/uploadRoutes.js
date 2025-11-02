const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Use Cloudinary storage for uploads
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'linklite_uploads', // folder name in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'mp4'],
  },
});

const upload = multer({ storage });

// ✅ POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({
      message: 'File uploaded successfully',
      url: req.file.path, // cloudinary file URL
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

module.exports = router;
