// api/resumen.js
export default async function handler(req, res) {
  try {
    const url = 'https://www.gob.mx/presidencia/es/archivo/articulos?filter%5Bcategory%5D=conferencias-matutinas';

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();

    // Extraer los últimos resúmenes usando regex
    const regex = /<h2 class="titulo">([^<]+)<\/h2>[\s\S]*?<p>([\s\S]*?)<\/p>/g;
    let matches = [];
    let match;

    while ((match = regex.exec(html)) !== null) {
      const titulo = match[1].trim();
      // Eliminar cualquier etiqueta HTML restante en la descripción
      const descripcion = match[2]
        .replace(/<[^>]*>/g, '') // quita todas las etiquetas HTML
        .replace(/\s+/g, ' ')    // normaliza espacios
        .trim();

      if (titulo && descripcion) {
        matches.push(`*${titulo}*\n${descripcion}`);
      }

      if (matches.length >= 3) break; // Solo los 3 más recientes
    }

    const resumen = matches.length 
      ? matches.join('\n\n')
      : 'Sin resumen disponible';

    // Configurar cabeceras y responder con JSON
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ resumen });

  } catch (error) {
    console.error('Error en el scraping:', error.message);
    res.status(500).json({ error: 'Error obteniendo resumen oficial' });
  }
}
