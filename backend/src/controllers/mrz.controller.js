const fs = require('fs');
const ocrService = require('../services/ocr.service');
const mrzParser = require('../utils/mrzParser');

exports.processImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se recibió imagen válida' });
  }

  const filePath = req.file.path;

  try {
    const rawText = await ocrService.recognize(filePath);
    const parsed = mrzParser.parse(rawText || '');

    fs.unlink(filePath, () => {});

    return res.json({
      rawText,
      ...parsed
    });
  } catch (err) {
    console.error('Error OCR:', err);
    fs.unlink(filePath, () => {});
    return res.status(500).json({ error: 'Error procesando OCR' });
  }
};