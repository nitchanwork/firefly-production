import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const root = new URL('../', import.meta.url);

async function collectFiles(dirUrl, extensions = new Set(['.astro', '.ts', '.js', '.mjs'])) {
  const dirPath = dirUrl.pathname;
  const entries = await readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(new URL(entry.name + '/', dirUrl), extensions));
    } else if (extensions.has(extname(entry.name))) {
      files.push(full);
    }
  }

  return files;
}

test('internal static links remain compatible with GitHub Pages base path', async () => {
  const src = new URL('../src/', import.meta.url);
  const files = await collectFiles(src);

  for (const file of files) {
    const text = await readFile(file, 'utf8');
    assert.equal(
      /(?:href|src)=["']\/(?!\/)/.test(text),
      false,
      `${file} contains a root-relative href/src that can bypass Astro BASE_URL`
    );
  }
});

test('social preview uses a real PNG asset', async () => {
  const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  assert.match(layout, /og-image\.png/);
  assert.doesNotMatch(layout, /faviconDataUri/);

  const png = await readFile(new URL('../public/og-image.png', import.meta.url));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
});

test('robots and sitemap target the deployed project-site base path', async () => {
  const robots = await readFile(new URL('../public/robots.txt', import.meta.url), 'utf8');
  assert.match(robots, /https:\/\/nitchanwork\.github\.io\/firefly-production\/sitemap\.xml/);

  const sitemap = await readFile(new URL('../src/pages/sitemap.xml.ts', import.meta.url), 'utf8');
  assert.match(sitemap, /import\.meta\.env\.BASE_URL/);
});
