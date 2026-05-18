const Tesseract = require('tesseract.js');

// Lógica del Parser (tu código original)
function parseMRZ(rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  let rut = 'No detectado';
  let name = 'No detectado';
  let expiry = 'No detectado';

  lines.forEach(line => {
    const cleanLine = line.replace(/\s/g, '').toUpperCase();

    const rutMatch = cleanLine.match(/(\d{7,8})<(\d|K)/);
    if (rutMatch) {
      rut = `${rutMatch[1]}-${rutMatch[2]}`;
    }

    if (cleanLine.includes('<<')) {
      name = cleanLine.replace(/</g, ' ').replace(/\s+/g, ' ').trim();
    }

    const dateMatch = cleanLine.match(/(\d{6})\d[MF](\d{6})/);
    if (dateMatch) {
      const rawDate = dateMatch[2];
      expiry = `${rawDate.substring(4, 6)}/${rawDate.substring(2, 4)}/20${rawDate.substring(0, 2)}`;
    }
  });

  return { rut, name, expiry };
}

// Handler para Vercel
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // En Vercel, el cuerpo de la petición puede venir como un buffer si se envía correctamente
    // Para manejar multipart/form-data de forma sencilla sin multer (que requiere disco):
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Realizar el OCR usando Tesseract
    const result = await Tesseract.recognize(buffer, 'eng', {
      tessedit_char_whitelist: 'ABCDEFGHIJKLM NO PQRSTUVWXYZ0123456789<>\n .',
      tessedit_pageseg_mode: 6
    });

    const rawText = result.data && result.data.text ? result.data.text : '';
    const parsedData = parseMRZ(rawText);

    return res.status(200).json({
      rawText,
      ...parsedData
    });

  } catch (error) {
    console.error('Error en el servidor OCR:', error);
    return res.status(500).json({ error: 'Error procesando la imagen', details: error.message });
  }
}