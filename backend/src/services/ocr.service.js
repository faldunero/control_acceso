const Tesseract = require('tesseract.js');

exports.recognize = async (imagePath) => {
  const result = await Tesseract.recognize(imagePath, 'eng', {
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<'
  });

  return result.data && result.data.text ? result.data.text : '';
};