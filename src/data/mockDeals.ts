export type Deal = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  retailers: { name: string; price: number }[];
};

// Placeholder deal data so Flixnder is testable before the affiliate API
// integrations (ShopStyle/Rakuten/Amazon) are wired up in a later pass.
export const MOCK_DEALS: Deal[] = [
  {
    id: '1',
    title: 'Oversized Denim Jacket',
    category: 'Outerwear',
    imageUrl: 'https://picsum.photos/seed/flixit-jacket/600/800',
    retailers: [
      { name: 'ASOS', price: 68 },
      { name: 'Amazon', price: 74.99 },
      { name: 'Zara', price: 79 },
    ],
  },
  {
    id: '2',
    title: 'Classic White Sneakers',
    category: 'Shoes',
    imageUrl: 'https://picsum.photos/seed/flixit-sneakers/600/800',
    retailers: [
      { name: 'Nike', price: 90 },
      { name: 'Amazon', price: 84.5 },
    ],
  },
  {
    id: '3',
    title: 'Ribbed Knit Sweater',
    category: 'Top',
    imageUrl: 'https://picsum.photos/seed/flixit-sweater/600/800',
    retailers: [
      { name: 'ASOS', price: 42 },
      { name: 'H&M', price: 34.99 },
    ],
  },
  {
    id: '4',
    title: 'Wide-Leg Trousers',
    category: 'Bottom',
    imageUrl: 'https://picsum.photos/seed/flixit-trousers/600/800',
    retailers: [
      { name: 'Zara', price: 59 },
      { name: 'ShopStyle', price: 52.3 },
    ],
  },
  {
    id: '5',
    title: 'Minimalist Leather Belt',
    category: 'Accessory',
    imageUrl: 'https://picsum.photos/seed/flixit-belt/600/800',
    retailers: [
      { name: 'Amazon', price: 24.99 },
      { name: 'ASOS', price: 28 },
    ],
  },
];
