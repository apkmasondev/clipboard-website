import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(path.join(root, 'index.html'), 'utf8');
test('Wszystkie lokalne odnośniki, zasoby i kotwice mają cel', async () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Powtórzone identyfikatory');
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^https:\/\//.test(value) || value === '#') continue;
    if (value.startsWith('#')) assert.ok(ids.includes(value.slice(1)), `Brak kotwicy ${value}`);
    else await access(path.join(root, value));
  }
  const css = await readFile(path.join(root, 'styles.css'), 'utf8');
  for (const [, value] of css.matchAll(/url\('([^']+)'\)/g)) await access(path.join(root, value));
});
test('Strona nie ładuje zewnętrznych skryptów, fontów ani trackerów', () => {
  assert.doesNotMatch(html, /<script[^>]+src="https?:/i);
  assert.doesNotMatch(html, /<link[^>]+(?:stylesheet|preload)[^>]+href="https?:/i);
  assert.doesNotMatch(html, /<img[^>]+src="https?:/i);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /<html lang="pl">/);
});
test('Wydanie i instalator wskazują ten sam publiczny release', () => {
  const downloads = [
    ...html.matchAll(
      /https:\/\/github\.com\/apkmasondev\/clipboard\/releases\/download\/([^/]+)\/([^"<]+)/g,
    ),
  ];
  assert.ok(downloads.length >= 2);
  for (const [, version] of downloads) assert.equal(version, 'v1.1.1');
  assert.ok(downloads.some(([, , file]) => file === 'Super.Clipboard_1.1.1_x64-setup.exe'));
  assert.match(html, /Instalator nie jest podpisany/);
});
test('Obrazy mają opisy i wymiary, strona ma jeden nagłówek główny', () => {
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  for (const [image] of html.matchAll(/<img\b[^>]*>/g)) {
    assert.match(image, /alt="[^"]*"/);
    assert.match(image, /width="\d+"/);
    assert.match(image, /height="\d+"/);
  }
});
test('Publiczne zasoby nie zawierają plików danych użytkownika i mieszczą się w budżecie', async () => {
  let bytes = 0;
  for (const name of await readdir(path.join(root, 'assets'))) {
    assert.match(name, /\.(jpg|ico|ttf|woff2|txt)$/);
    bytes += (await stat(path.join(root, 'assets', name))).size;
  }
  assert.ok(bytes < 1_500_000, `Zasoby ważą ${bytes} bajtów`);
});
