// frontend/api/mrz.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Aquí es donde irá tu lógica de OCR más adelante
    // Por ahora, devolvemos un éxito para probar la conexión
    res.status(200).json({ 
      rawText: "Conexión exitosa", 
      name: "Usuario de Prueba",
      rut: "12.345.678-9",
      expiry: "01/01/2030"
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
