import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeInstagramUrl } from '../src/utils/instagram.ts';
import {
  instagramPostPublishedAtFromUrl,
  portfolioBrands,
  portfolioPostPublishedAt,
  portfolioPostUrl,
  sortPortfolioPosts
} from '../src/data/portfolio.ts';

test('portfolio counts and canonical URLs remain valid', () => {
  assert.deepEqual(
    portfolioBrands.map(brand => [brand.id, brand.photography.length, brand.videography.length]),
    [
      ['haab', 68, 22],
      ['layers', 100, 19],
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

  assert.equal(allPosts.length, 287);

  const publishedDates = allPosts.map(portfolioPostPublishedAt);
  assert.equal(publishedDates.filter(Boolean).length, 287);
  assert.equal([...publishedDates].sort()[0], '2024-05-17');
  assert.equal([...publishedDates].sort().at(-1), '2026-10-01');

  for (const post of allPosts) {
    assert.equal(typeof post, 'object', 'current portfolio entries should store audited publish dates');
    assert.match(post.publishedAt, /^\d{4}-\d{2}-\d{2}$/);
  }

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
    'undated-a',
    { url: 'https://www.instagram.com/p/OLDER/', publishedAt: '2026-01-05' },
    'undated-b',
    { url: 'https://www.instagram.com/p/NEWER/', publishedAt: '2026-09-29' },
  ];

  assert.deepEqual(
    sortPortfolioPosts(posts).map(portfolioPostUrl),
    [
      'https://www.instagram.com/p/NEWER/',
      'https://www.instagram.com/p/OLDER/',
      'undated-a',
      'undated-b',
    ]
  );
});


test('Instagram shortcode date fallback returns Bangkok calendar dates', () => {
  assert.equal(
    instagramPostPublishedAtFromUrl('https://www.instagram.com/p/DbxAlgoEktp/'),
    '2026-08-08'
  );

  assert.equal(
    instagramPostPublishedAtFromUrl('https://www.instagram.com/p/C9j8R6HSOhY/'),
    '2024-07-18'
  );

  assert.equal(instagramPostPublishedAtFromUrl('https://example.com/not-instagram'), undefined);
});

test('October 7 portfolio intake preserves verified ratios and Bangkok dates', () => {
  const expected = [
    {
      "brand": "haab",
      "type": "photography",
      "code": "Ddq721uEtsD",
      "ratio": "3:4",
      "publishedAt": "2026-09-24"
    },
    {
      "brand": "haab",
      "type": "photography",
      "code": "DdsjY1PkmX1",
      "ratio": "3:4",
      "publishedAt": "2026-09-25"
    },
    {
      "brand": "haab",
      "type": "photography",
      "code": "DdyncNOEq8w",
      "ratio": "3:4",
      "publishedAt": "2026-09-27"
    },
    {
      "brand": "haab",
      "type": "photography",
      "code": "Dd8FuGMS1v4",
      "ratio": "3:4",
      "publishedAt": "2026-10-01"
    },
    {
      "brand": "haab",
      "type": "photography",
      "code": "Dd8GiEsyRnE",
      "ratio": "3:4",
      "publishedAt": "2026-10-01"
    },
    {
      "brand": "haab",
      "type": "photography",
      "code": "Dd8HQtryq4U",
      "ratio": "3:4",
      "publishedAt": "2026-10-01"
    },
    {
      "brand": "haab",
      "type": "videography",
      "code": "Dd1HpOFSgro",
      "ratio": "9:16",
      "publishedAt": "2026-09-28"
    },
    {
      "brand": "layers",
      "type": "photography",
      "code": "Dd54lGSFAjz",
      "ratio": "4:5",
      "publishedAt": "2026-09-30"
    }
  ];
  for (const item of expected) {
    const brand = portfolioBrands.find(brand => brand.id === item.brand);
    assert.ok(brand, `Missing brand ${item.brand}`);
    const post = brand[item.type].find(post => portfolioPostUrl(post).includes(`/${item.code}/`));
    assert.ok(post, `Missing portfolio post ${item.code}`);
    assert.equal(portfolioPostPublishedAt(post), item.publishedAt);
    assert.equal(typeof post === 'string' ? undefined : post.ratio, item.ratio === (item.type === 'photography' ? '4:5' : '9:16') ? undefined : item.ratio);
  }
});
