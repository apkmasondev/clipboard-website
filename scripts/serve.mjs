import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, stat } from 'node:fs/promises';

const project = fileURLToPath(new URL('../', import.meta.url));
const root = path.resolve(project, process.argv[2] === 'dist' ? 'dist' : '.');
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};
const server = http.createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const route = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = route.replace(/^\/+/, '') || 'index.html';
    // Serwer developerski udostępnia wyłącznie publiczne zasoby.
    if (
      !(
        relative.startsWith('assets/') ||
        ['index.html', 'styles.css', 'app.js', 'robots.txt', 'sitemap.xml', '404.html'].includes(
          relative,
        )
      ) ||
      relative.includes('..') ||
      relative.includes('\\')
    ) {
      response.writeHead(404).end('Nie znaleziono');
      return;
    }
    const file = path.resolve(root, relative);
    if (!file.startsWith(root + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    if (!(await stat(file)).isFile()) {
      response.writeHead(404).end();
      return;
    }
    const content = await readFile(file);
    response.writeHead(200, {
      'Content-Type': types[path.extname(file)] || 'application/octet-stream',
      'Content-Length': content.length,
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Nie znaleziono');
  }
});
server.on('error', (error) => {
  process.stderr.write(`Nie udało się uruchomić podglądu: ${error.message}\n`);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () =>
  process.stdout.write(`Super Clipboard: http://127.0.0.1:${port}\n`),
);
