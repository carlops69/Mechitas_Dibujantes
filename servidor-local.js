/**
 * Servidor local para Mechitas Dibujante.
 * A diferencia de "python -m http.server", este SI manda el tipo correcto
 * para .webp (image/webp), que es justo lo que hace GitHub Pages.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIR = 'C:\\Users\\carlo\\OneDrive\\Escritorio\\GitHub Pages\\Personales\\Mechitas_Dibujante';
const PORT = 8080;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8'
};

http.createServer((req, res) => {
    let ruta = decodeURIComponent(req.url.split('?')[0]);
    if (ruta === '/') ruta = '/index.html';

    const archivo = path.join(DIR, ruta);
    // Seguridad: que no se salga de la carpeta
    if (!archivo.startsWith(DIR)) { res.writeHead(403); return res.end('Prohibido'); }

    fs.readFile(archivo, (err, data) => {
        if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('No encontrado'); }
        const ext = path.extname(archivo).toLowerCase();
        res.writeHead(200, {
            'Content-Type': MIME[ext] || 'application/octet-stream',
            'Content-Length': data.length,
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
}).listen(PORT, '127.0.0.1', () => {
    console.log('Servidor de Mechitas Dibujante listo');
    console.log('  http://127.0.0.1:' + PORT + '/');
    console.log('  (manda image/webp correctamente, como GitHub Pages)');
});
