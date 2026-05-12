const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');

// ============================================================
// CLOUDINARY CONFIG
// ============================================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ============================================================
// MULTER — MEMORY STORAGE
// ============================================================

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
    'application/pdf'
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (JPG, PNG, WEBP) and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ============================================================
// UPLOAD FILE TO CLOUDINARY — UNSIGNED PRESET
// No signature generated. No signature error possible.
// ============================================================

const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype === 'application/pdf' ? 'raw' : 'image';
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        upload_preset: 'zed_uploads',
        resource_type: resourceType
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// ============================================================
// EXTRACT TEXT FROM FILE
// PDF → pdf-parse
// Image → Tesseract.js
// ============================================================

const extractTextFromFile = async (buffer, mimetype) => {
  try {
    if (mimetype === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      return pdfData.text || '';
    } else {
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng');
      return text || '';
    }
  } catch (err) {
    console.error('Text extraction error:', err.message);
    return '';
  }
};

// ============================================================
// PROCESS UPLOAD — MAIN FUNCTION
// ============================================================

const processUpload = async (file) => {
  const { buffer, mimetype, originalname } = file;

  const cloudinaryResult = await uploadToCloudinary(buffer, mimetype);
  const extractedText = await extractTextFromFile(buffer, mimetype);

  return {
    url: cloudinaryResult.secure_url,
    publicId: cloudinaryResult.public_id,
    extractedText,
    fileName: originalname,
    fileType: mimetype === 'application/pdf' ? 'pdf' : 'image'
  };
};

module.exports = { upload, processUpload };