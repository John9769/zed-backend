const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const pdfParse = require('pdf-parse');
const path = require('path');

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
// Files stored in memory buffer, not disk
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
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// ============================================================
// UPLOAD FILE TO CLOUDINARY
// ============================================================

const uploadToCloudinary = (buffer, mimetype, folder = 'zed_uploads') => {
  return new Promise((resolve, reject) => {
    const resourceType = mimetype === 'application/pdf' ? 'raw' : 'image';
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        ocr: mimetype !== 'application/pdf' ? 'adv_ocr' : undefined
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
// Image → Cloudinary OCR result
// ============================================================

const extractTextFromFile = async (buffer, mimetype, cloudinaryResult) => {
  try {
    if (mimetype === 'application/pdf') {
      const pdfData = await pdfParse(buffer);
      return pdfData.text || '';
    } else {
      // Get OCR text from Cloudinary result
      const ocrText = cloudinaryResult?.info?.ocr?.adv_ocr?.data?.[0]?.fullTextAnnotation?.text || '';
      return ocrText;
    }
  } catch (err) {
    console.error('Text extraction error:', err.message);
    return '';
  }
};

// ============================================================
// PROCESS UPLOAD — MAIN FUNCTION
// Upload file + extract text in one call
// ============================================================

const processUpload = async (file) => {
  const { buffer, mimetype, originalname } = file;

  // Upload to Cloudinary
  const cloudinaryResult = await uploadToCloudinary(buffer, mimetype);

  // Extract text
  const extractedText = await extractTextFromFile(buffer, mimetype, cloudinaryResult);

  return {
    url: cloudinaryResult.secure_url,
    publicId: cloudinaryResult.public_id,
    extractedText,
    fileName: originalname,
    fileType: mimetype === 'application/pdf' ? 'pdf' : 'image'
  };
};

module.exports = { upload, processUpload };