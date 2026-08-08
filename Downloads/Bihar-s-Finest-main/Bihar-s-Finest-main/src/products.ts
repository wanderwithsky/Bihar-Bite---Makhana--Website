export interface ProductData {
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
  category?: string;
  isNew?: boolean;
  rating?: number;
  reviews?: number;
  stock?: string | number;
  video?: string;
  priceDisplay?: string;
  taxLabel?: string;
}

export const productsData: ProductData[] = [
  {
    slug: 'premium-plain-makhana',
    name: 'Premium Plain Makhana',
    price: 199,
    mrp: 249,
    discount: 20,
    weight: '250g',
    description: 'Our signature raw Phool Makhana, sourced directly from the finest ponds in Mithila. Perfectly graded, large size, and exceptionally clean. Ideal for roasting at home or making traditional curries and kheer.',
    images: ['/products/plain-makhana.png'],
    isBestseller: true,
    amazonUrl: '',
    weights: ['100g', '250g', '500g', '1 KG'],
    weightPrices: { '100g': 99, '250g': 199, '500g': 389, '1 KG': 749 }
  },
  {
    slug: 'roasted-makhana',
    name: 'Roasted Makhana',
    price: 229,
    mrp: 299,
    discount: 23,
    weight: '100g',
    description: 'Delicately roasted with subtle hints of mineral-rich pink salt. The perfect guilt-free crunch for your evening snack cravings.',
    images: ['/products/roasted-makhana.png'],
    isBestseller: true,
    amazonUrl: '',
    weights: ['100g', '250g', '500g', '1 KG'],
    weightPrices: { '100g': 229, '250g': 499, '500g': 899, '1 KG': 1699 }
  },
  {
    slug: '4-suta-loose-makhana',
    name: '4 Suta Loose Makhana',
    price: 550,
    mrp: 650,
    discount: 15,
    weight: '1 KG',
    description: 'High-quality 4 Suta graded loose Makhana. Clean, crisp, and perfect for bulk home consumption, roasting, and traditional Indian recipes.',
    images: ['/products/plain-makhana.png'],
    video: '/products/4 suta.mp4',
    taxLabel: 'Inclusive of transportation and all taxes.',
    isBestseller: true,
    amazonUrl: '',
    weights: ['1 KG'],
    weightPrices: { '1 KG': 550 }
  },
  {
    slug: '5-suta-loose-makhana',
    name: '5 Suta Loose Makhana',
    price: 900,
    mrp: 1050,
    discount: 14,
    weight: '1 KG',
    description: 'Premium 5 Suta graded loose Makhana. Larger size and superior crunch. Ideal for gourmet dishes and premium daily snacking.',
    images: ['/products/plain-makhana.png'],
    video: '/products/5 suta.mp4',
    taxLabel: 'Inclusive of transportation and all taxes.',
    isBestseller: true,
    amazonUrl: '',
    weights: ['1 KG'],
    weightPrices: { '1 KG': 900 }
  },
  {
    slug: '6-suta-handpick-loose-makhana',
    name: '6 Suta Handpick Loose Makhana',
    price: 1250,
    mrp: 1400,
    discount: 11,
    weight: '1 KG',
    description: 'The highest quality 6 Suta handpicked Makhana. Extra-large, perfectly round, and carefully sorted for the ultimate luxury Fox Nut experience.',
    images: ['/products/plain-makhana.png'],
    video: '/products/6 suta.mp4',
    taxLabel: 'Inclusive of transportation and all taxes.',
    isBestseller: true,
    amazonUrl: '',
    weights: ['1 KG'],
    weightPrices: { '1 KG': 1250 }
  },
  {
    slug: 'makhana-papad',
    name: 'Makhana Papad',
    price: 649,
    mrp: 799,
    discount: 19,
    weight: '1 KG',
    description: 'A revolutionary healthy twist on traditional papad. Made entirely from premium Makhana flour, these papads are incredibly light, crispy, and digest easily.',
    images: ['/products/makhana-papad.png'],
    amazonUrl: '',
    weights: ['200g', '500g', '1 KG'],
    weightPrices: { '200g': 149, '500g': 349, '1 KG': 649 }
  },
  {
    slug: 'makhana-cookies',
    name: 'Makhana Cookies',
    price: 109,
    mrp: 149,
    discount: 27,
    weight: '125g',
    description: 'Healthy, gluten-free cookies baked with Makhana flour, butter, and natural sweeteners. Perfect for toddlers, health-conscious adults, and guilt-free tea time.',
    images: ['/products/cookies.png'],
    amazonUrl: '',
    weights: ['125g', '250g', '500g'],
    weightPrices: { '125g': 109, '250g': 199, '500g': 399 }
  },
  {
    slug: 'gold-makhana',
    name: 'Gold Makhana',
    price: 245,
    mrp: 299,
    discount: 18,
    weight: '250g',
    description: 'Premium Gold Makhana sourced from Bihar\'s finest farms. Large kernels, naturally rich in protein, gluten-free and perfect for healthy snacking.',
    images: ['/products/gold-makhana.jpeg'],
    category: 'Premium',
    isNew: true,
    rating: 5.0,
    reviews: 12,
    stock: 'In Stock',
    amazonUrl: '',
    weights: ['250g'],
    weightPrices: { '250g': 245 }
  },
  {
    slug: '10-kg-loose-makhana',
    name: '10 KG Loose Makhana',
    price: 849,
    mrp: 1000,
    discount: 15,
    weight: '10 KG',
    description: 'Ideal for wholesalers, retailers, distributors and bulk buyers. Premium loose makhana with consistent grading and export-quality selection.',
    images: ['/products/loose-makhana.jpeg'],
    category: 'Featured',
    rating: 5.0,
    stock: 'In Stock',
    amazonUrl: '',
    weights: ['10 KG'],
    weightPrices: { '10 KG': 849 }
  }
];
