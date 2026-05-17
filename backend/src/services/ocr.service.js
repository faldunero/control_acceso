const Tesseract = require('tesseract.js');

exports.recognize = async (imagePath) => {
  const result = await Tesseract.recognize(imagePath, 'eng', {
    tessedit_char_whitelist: 'ABCDEFGHIJKLM NO PQRSTUVWXYZ0123456789<>\n .',
    tessedit_pageseg_mode: 6  // SINGLE_BLOCK
  });
  return result.data && result.data.text ? result.data.text : '';
};