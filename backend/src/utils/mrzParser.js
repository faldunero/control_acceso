exports.parse = (rawText) => {
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
};