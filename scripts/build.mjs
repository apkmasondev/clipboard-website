import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
if (path.dirname(output) !== path.resolve(root))
  throw new Error('Nieprawidłowy katalog wyjściowy.');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
// Jawna lista plików publicznych: dokumentacja, testy i pliki robocze nie trafiają do witryny.
for (const file of [
  'index.html',
  'styles.css',
  'app.js',
  '.nojekyll',
  'robots.txt',
  'sitemap.xml',
  '404.html',
]) {
  await cp(path.join(root, file), path.join(output, file));
}
await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
process.stdout.write(`Zbudowano stronę: ${(await readdir(output)).length} elementów w dist.\n`);
