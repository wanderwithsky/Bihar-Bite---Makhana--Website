import fs from 'fs';

const filePath = './src/products.ts';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Interface
content = content.replace(
  /export interface ProductData \{[\s\S]*?\}/,
  `export interface ProductData {
  slug: string;
  name: string;
  price: number;
  mrp: number;
  discount: number;
  weight: string;
  description: string;
  images: string[];
  isBestseller?: boolean;
  amazonUrl?: string;
  weights?: string[];
  weightPrices?: { [key: string]: number };
}`
);

// Add the fields.
content = content.replace(/images:\s*\[[\s\S]*?\](,?\s*isBestseller:\s*(true|false))?/g, (match) => {
  return `${match},
    amazonUrl: '',
    weights: ['100g', '250g', '500g', '1 KG'],
    weightPrices: {
      '100g': 199,
      '250g': 399,
      '500g': 699,
      '1 KG': 1200
    }`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated products.ts');
