// api/resumen.js
export default async function handler(req, res) {
  try {
    // Resumen fijo para probar
    const resumen = "*Conferencia del 02 de octubre de 2025*\nVersión estenográfica. Conferencia de prensa de la presidenta Claudia Sheinbaum Pardo del 02 de octubre de 2025";

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resumen });

  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error interno' });
  }
}
