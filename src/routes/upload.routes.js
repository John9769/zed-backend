const express = require('express');
const router = express.Router();
const { authenticateStudent } = require('../middleware/auth');
const { upload, processUpload } = require('../utils/uploadHandler');

router.post('/document', authenticateStudent, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const result = await processUpload(req.file);

    return res.status(200).json({
      message: 'File uploaded successfully.',
      url: result.url,
      publicId: result.publicId,
      extractedText: result.extractedText,
      fileName: result.fileName,
      fileType: result.fileType
    });

  } catch (error) {
    console.error('Upload error:', error.message);
    return res.status(500).json({ error: 'Upload failed. Please try again.' });
  }
});

module.exports = router;