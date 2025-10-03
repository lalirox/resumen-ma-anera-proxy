// api/resumen.js
export default async function handler(req, res) {
  try {
    const url = 'https://www.gob.mx/presidencia/es/archivo/articulos?filter%5Bcategory%5D=conferencias-matutinas';

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Regex simple: busca cualquier <h2> o <h3> seguido de un <div>
    const regex = /<h[23][^>]*>([^<]+)<\/h[23]>[\s\S]*?<div[^>]*>([\s\S]*?)<\/div>/g;
    let matches = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
      const titulo = match[1].trim();
      const descripcion = match[2]
        .replace(/<[^>]*>/g, '') // quitar etiquetas HTML
        .replace(/\s+/g, ' ')    // normalizar espacios
        .trim();

      if (titulo && descripcion) {
        matches.push(`*${titulo}*\n${descripcion}`);
      }

      if (matches.length >= 3) break; // solo los 3 más recientes
    }

    const resumen = matches.length 
      ? matches.join('\n\n') 
      : 'Sin resumen disponible';

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resumen });

  } catch (error) {
    console.error('Error en el scraping:', error.message);
    res.status(500).json({ error: 'Error obteniendo resumen oficial' });
  }
}

git add .
git commit -m "Fix API structure"
git push
