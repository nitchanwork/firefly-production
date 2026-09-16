export type PortfolioCategory = 'photo' | 'video' | 'social';

export interface PortfolioItem {
  id: string;
  client: string;
  title: string;
  category: PortfolioCategory;
  type: string;
  year: number;
  instagramUrl: string;
  featured?: boolean;
}

// Paste a public Instagram Post or Reel URL into the relevant instagramUrl.
// Blank URLs show a placeholder. Add future entries here without changing the page.
export const portfolioItems: PortfolioItem[] = [
  {
    id: 'haab-photo-01', client: 'HAAB', title: 'Photography Work',
    category: 'photo', type: 'Photography', year: 2026,
    instagramUrl: '',
  },
  {
    id: 'haab-social-01', client: 'HAAB', title: 'Social Content',
    category: 'social', type: 'Social Content', year: 2026,
    instagramUrl: '',
  },
  {
    id: 'layers-photo-01', client: 'Layers', title: 'Photography Work',
    category: 'photo', type: 'Photography', year: 2026,
    instagramUrl: '',
  },
  {
    id: 'layers-social-01', client: 'Layers', title: 'Social Content',
    category: 'social', type: 'Social Content', year: 2026,
    instagramUrl: '',
  },
  {
    id: 'haroy-photo-01', client: 'HAROY', title: 'Photography Work',
    category: 'photo', type: 'Photography', year: 2026,
    instagramUrl: '',
  },
  {
    id: 'haroy-social-01', client: 'HAROY', title: 'Social Content',
    category: 'social', type: 'Social Content', year: 2026,
    instagramUrl: '',
  },
  {
    id: 'yogurbara-photo-01', client: 'YogurBara', title: 'Photography Work',
    category: 'photo', type: 'Photography', year: 2026,
    instagramUrl: '',
  },
  {
    id: 'yogurbara-social-01', client: 'YogurBara', title: 'Social Content',
    category: 'social', type: 'Social Content', year: 2026,
    instagramUrl: '',
  },
  {
    id: 'sushi-pop-photo-01', client: 'SUSHI POP', title: 'Photography Work',
    category: 'photo', type: 'Photography', year: 2026,
    instagramUrl: '',
  },
  {
    id: 'sushi-pop-social-01', client: 'SUSHI POP', title: 'Social Content',
    category: 'social', type: 'Social Content', year: 2026,
    instagramUrl: '',
  },
];
