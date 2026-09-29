import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInstagramUrl } from '../src/utils/instagram.ts';
import {
  portfolioBrands,
  portfolioPostUrl,
  sortPortfolioPosts
} from '../src/data/portfolio.ts';

test('portfolio counts and canonical URLs remain valid', () => {
  assert.deepEqual(
    portfolioBrands.map(brand => [brand.id, brand.photography.length, brand.videography.length]),
    [
      ['haab', 62, 21],
      ['layers', 99, 19],
      ['haroy', 13, 12],
      ['yogurbara', 17, 12],
      ['sushi-pop', 7, 3],
      ['hatch', 10, 4],
    ]
  );

  const brandIds = portfolioBrands.map(brand => brand.id);
  assert.equal(new Set(brandIds).size, brandIds.length);

  const allPosts = portfolioBrands.flatMap(brand => [
    ...brand.photography,
    ...brand.videography
  ]);

  assert.equal(allPosts.length, 279);

  for (const brand of portfolioBrands) {
    for (const type of ['photography', 'videography']) {
      const urls = brand[type].map(portfolioPostUrl).map(normalizeInstagramUrl);
      assert.ok(urls.every(Boolean), `${brand.id} ${type} contains an invalid Instagram URL`);
      assert.equal(
        new Set(urls).size,
        urls.length,
        `${brand.id} ${type} contains a duplicate Instagram URL`
      );
    }
  }

  assert.equal(
    normalizeInstagramUrl(' https://instagram.com/reel/ABC_12-/?img_index=3#test '),
    'https://www.instagram.com/reel/ABC_12-/'
  );

  assert.equal(
    normalizeInstagramUrl('https://instagram.com.evil.example/p/ABC/'),
    ''
  );
});

test('dated portfolio posts sort newest first without reordering undated work', () => {
  const posts = [
    'https://www.instagram.com/p/UNDATED_A/',
    { url: 'https://www.instagram.com/p/OLDER/', publishedAt: '2026-01-05' },
    'https://www.instagram.com/p/UNDATED_B/',
    { url: 'https://www.instagram.com/p/NEWER/', publishedAt: '2026-09-29' },
  ];

  assert.deepEqual(
    sortPortfolioPosts(posts).map(portfolioPostUrl),
    [
      'https://www.instagram.com/p/NEWER/',
      'https://www.instagram.com/p/OLDER/',
      'https://www.instagram.com/p/UNDATED_A/',
      'https://www.instagram.com/p/UNDATED_B/',
    ]
  );
});
