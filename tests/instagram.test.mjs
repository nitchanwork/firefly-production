import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInstagramUrl } from '../src/utils/instagram.ts';
import { portfolioBrands } from '../src/data/portfolio.ts';

test('portfolio counts and canonical uniqueness', () => {
  assert.deepEqual(portfolioBrands.map(b => [b.id, b.photography.length, b.videography.length]), [
    ['haab',62,21], ['layers',99,19], ['haroy',0,0], ['yogurbara',17,12], ['sushi-pop',7,3], ['hatch',10,4],
  ]);
  const urls = portfolioBrands.flatMap(b => [...b.photography, ...b.videography]).map(normalizeInstagramUrl);
  assert.equal(urls.length, 254);
  assert.ok(urls.every(Boolean));
  assert.equal(new Set(urls).size, 254);
  assert.equal(normalizeInstagramUrl(' https://instagram.com/reel/ABC_12-/?img_index=3#test '), 'https://www.instagram.com/reel/ABC_12-/');
  assert.equal(normalizeInstagramUrl('https://instagram.com.evil.example/p/ABC/'), '');
});

