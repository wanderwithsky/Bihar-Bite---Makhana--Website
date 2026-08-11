import { Product } from './types';

export const products: Product[] = [
  {
    id: 'himalayan-pink-salt',
    name: 'Himalayan Pink Salt Roasted',
    description: 'Delicately roasted with subtle hints of mineral-rich pink salt. Perfect crunch and eye-safe twilight aesthetic.',
    price: 349,
    originalPrice: 399,
    category: 'Roasted',
    flavors: ['Himalayan Salt'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE8NZSYfiYMC09NWAibdLNv51ejq_Qp1-IFFWffR4LcaiYNtj0A3_mCmJVgCb__MAvXOpTgarPpFjmIQpgJTjBptORCKIGkbJT4cDDgacGBmknR6wR0eRTBJ96olvbu-8lFwFRqLLWRWxjRLJXlf9LBvaW7avfUswRCpqzZx_O_wMbqAcfYXd9s9_DDpMApj1AMKne5x_XkoB3G9xA9e1hGovyZj0G8ZBQ5Ed4cULYicJxBjWcGX6Hpw',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAeFYgCxP5A0_pK4KhY5-yEMquxVfiXvJ1Qrp_kVb_nKFR-Y-AAPJYcuBC1e5YsDgLx9lXC0eiu7CylCOb3BdqEktK541jAnk4rwBd-CGzJIBxoEMGV2jyCGhMgKqZmToiHZYVqzEe2MGvzIZ8jglsVo9GQEw5DLUMdn7gB7wuOqdZGAQY3gkKg4CIA2-2qJ8I5ORNEB83AfDF3N1eOfKNxIO1mILrYWIRgqfSJsZ7NioB0J78v-xEswg',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC9fWhGNNgcRjoK8W0ntw5HuZIHHzOjIAjF_5CeQNpwRclfgIM-DGSWsYcUXttaNfcj4knXYntQJNTUZ9Sj9rdogL1zqKws6tlA836Yve5E6KyEja20C5pevXbFrS881vUvNRt-DyMy1o2eI3px6MKu1iYX3I6md1dweaVabMB4bm-HcvX4QEsIR-6sy5fpL7paQQiN43G49oan21Q2TVfE2KBts-vp64609N39yApDotaNN0q-aNBLbQ',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBjMvP6O8lKWJwJo9Cqn4w6QgstXDrCK-2iD5v26S8baN80zbC9pY4GG0ZipEM2fR4eRN03E8Q7Gy713OrWWKzKjIeeb6Ggqx79sMWLm1z-gZxdw7YU4YhniNFX62ljNP5V7sxleZj8EUbcoFD_bwL2ENz6aE6knV4W6XIHhB9eHmhHQhzkb7IgA87rcb2wJ7YPB3R8zqCEUM3a8OaSs_eRqyBC67hyEoeQMGI82bC4RPPQ0WYlq_H6iA',
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyVd2qbjM2Naidxw0Rit4TOSH0-i_1ra5FmQWMMaESQ0ErqOPo6Ol_sUWBw8AKT1tVCOQulrZcxt2aO7eAJg71mxq94-JYkPJJRnoEI6_S_X_IDTXsrzAPMHOxc-_lYla-gkiPuekInkZ3vuPkzU0Z0O8qLffAXKWW14v7PeQq2xSWH5FF_26b_YnF5Eu2-WT96D3TTo1eS-pXpJj-yTggYnEjDY9uMLibHl00esEQ2fhJSKDYiG6IXg'
    ],
    weights: ['100g', '250g', '500g'],
    weightPrices: {
      '100g': 149,
      '250g': 349,
      '500g': 649
    },
    rating: 4.8,
    reviewCount: 124,
    isBestseller: true,
    tagline: 'Delicate and perfectly crunchy',
    nutritionalInfo: {
      calories: '347 kcal',
      protein: '9.7g',
      fiber: '14.5g',
      fat: '0.1g'
    },
    reviews: [
      { id: '1', userName: 'Aarav Sharma', rating: 5, date: '2026-06-15', comment: 'Absolutely brilliant crunch and the pink salt taste is very balanced!' },
      { id: '2', userName: 'Priya Patel', rating: 4.5, date: '2026-07-02', comment: 'Very high quality, large seeds. Best makhana brand I have tasted.' },
      { id: '3', userName: 'Rohan Mehra', rating: 5, date: '2026-07-10', comment: 'Pure, clean, and delicious snack. Sourced from authentic ponds!' }
    ]
  },
  {
    id: 'aged-cheddar-herb',
    name: 'Aged Cheddar & Herb',
    description: 'Rich, savory profile with premium aged cheddar and a blend of organic herbs scatter-dusted beautifully.',
    price: 389,
    originalPrice: 429,
    category: 'Flavoured',
    flavors: ['Cheese'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBpX6KqIkd4aGLgWBUKzrmD2Q5i5rlv1_NMZqu4KSkS1WHJ2jxozKLS9BURwvjst8VcBo8reqRoN9UhKLrDzCuZOq5l4Vm0Xo0PPOPzGYXmGNPbVktqouHkgkDI9XxEwy6bPYWo0E634IkX3cZRK3pU0d-zcx78dGXywOWip4GDs-VwavWBLFgpC6YbzBKB56ahX3UgM2shrOosvB2ehIJBkjy-Wb9KmGlyyjBOoEhvrq_0chKG9QVWg',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBBpX6KqIkd4aGLgWBUKzrmD2Q5i5rlv1_NMZqu4KSkS1WHJ2jxozKLS9BURwvjst8VcBo8reqRoN9UhKLrDzCuZOq5l4Vm0Xo0PPOPzGYXmGNPbVktqouHkgkDI9XxEwy6bPYWo0E634IkX3cZRK3pU0d-zcx78dGXywOWip4GDs-VwavWBLFgpC6YbzBKB56ahX3UgM2shrOosvB2ehIJBkjy-Wb9KmGlyyjBOoEhvrq_0chKG9QVWg'
    ],
    weights: ['100g', '250g', '500g'],
    weightPrices: {
      '100g': 169,
      '250g': 389,
      '500g': 729
    },
    rating: 4.7,
    reviewCount: 98,
    isBestseller: false,
    tagline: 'Savory cheese delight',
    nutritionalInfo: {
      calories: '390 kcal',
      protein: '10.2g',
      fiber: '12.8g',
      fat: '4.5g'
    },
    reviews: [
      { id: '1', userName: 'Meera Sen', rating: 5, date: '2026-05-18', comment: 'Smells amazing! The real cheese powder makes a huge difference.' }
    ]
  },
  {
    id: 'premium-raw-phool',
    name: 'Premium Raw Phool',
    description: 'Unroasted, raw lotus seeds. Ideal for cooking authentic curries, kheer, or roasting at home.',
    price: 599,
    originalPrice: 699,
    category: 'Plain',
    flavors: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3qNYzTGVKHqibfdRoCjWoVL1W1xMxcJXVueJ8SDASbkfYI5SmxKmV_-7GAax1YSEWpGAhHE6l7AuziuxXyBuny6tj6v_PrkdtMjYmix8iivpI8HsFy2MUoDvy-hN_kWPB0UV1f0sOTw63zbPBJvhZMefS2iP07s5LvHycFpBQENYmtH1YpcJg_PxVy2LZdMAJSRj7vOJiZ_APU_voXfUvX9-ICrgZaaXwdrJBfKcmNuRLO971PFWHPg',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3qNYzTGVKHqibfdRoCjWoVL1W1xMxcJXVueJ8SDASbkfYI5SmxKmV_-7GAax1YSEWpGAhHE6l7AuziuxXyBuny6tj6v_PrkdtMjYmix8iivpI8HsFy2MUoDvy-hN_kWPB0UV1f0sOTw63zbPBJvhZMefS2iP07s5LvHycFpBQENYmtH1YpcJg_PxVy2LZdMAJSRj7vOJiZ_APU_voXfUvX9-ICrgZaaXwdrJBfKcmNuRLO971PFWHPg'
    ],
    weights: ['250g', '500g', '1kg'],
    weightPrices: {
      '250g': 179,
      '500g': 329,
      '1kg': 599
    },
    rating: 4.9,
    reviewCount: 154,
    isNew: true,
    tagline: 'Pristine raw fox nuts',
    nutritionalInfo: {
      calories: '310 kcal',
      protein: '11.1g',
      fiber: '16.0g',
      fat: '0.1g'
    },
    reviews: [
      { id: '1', userName: 'Karan J.', rating: 5, date: '2026-07-01', comment: 'Very large white seeds with minimal waste. Extremely pure.' }
    ]
  },
  {
    id: 'classic-raw-makhana',
    name: 'Classic Raw Makhana',
    description: 'The pure, unadulterated crunch of nature. Lightly airy, raw phool makhana ready for custom seasoning.',
    price: 199,
    originalPrice: 249,
    category: 'Plain',
    flavors: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT3lfMzCIqYySdIXGHmYYJEhvR_MENrENhVwKei1Qcgi1G_1o1aFHUObYbWgvWShC-UPm1DArLelvtkoM8U9o2IRwHgA3Ji58sI6NDtXILTiSECVDiev1OqyLSfYmHefU4x7VmqwtH5cK9PS870GBLUVl2tPziLlgWdbPxBENkV3x9_NrtWeAxgslJNUbOWSAy85W9XRbhl98aILphq6wwEf0hHh2WwDKLR2F4X6NNPfeO0KZsMYWBag',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBT3lfMzCIqYySdIXGHmYYJEhvR_MENrENhVwKei1Qcgi1G_1o1aFHUObYbWgvWShC-UPm1DArLelvtkoM8U9o2IRwHgA3Ji58sI6NDtXILTiSECVDiev1OqyLSfYmHefU4x7VmqwtH5cK9PS870GBLUVl2tPziLlgWdbPxBENkV3x9_NrtWeAxgslJNUbOWSAy85W9XRbhl98aILphq6wwEf0hHh2WwDKLR2F4X6NNPfeO0KZsMYWBag'
    ],
    weights: ['100g', '250g', '500g'],
    weightPrices: {
      '100g': 99,
      '250g': 199,
      '500g': 379
    },
    rating: 4.6,
    reviewCount: 74,
    tagline: 'Standard airy superfood',
    nutritionalInfo: {
      calories: '315 kcal',
      protein: '10.8g',
      fiber: '15.2g',
      fat: '0.1g'
    },
    reviews: []
  },
  {
    id: 'smoked-peri-peri',
    name: 'Smoked Peri-Peri Makhana',
    description: 'Bold, spicy, and roasted with authentic hot African bird-eye chili blend. Irresistible smoky tang!',
    price: 279,
    originalPrice: 329,
    category: 'Flavoured',
    flavors: ['Peri Peri'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Wsnj84UebVbOWYW8aChTcdEpCLjduYjSDQJUHS4CvIlLyJn8mvy5O1HOD0Ei5EKDn90WpFmK3VqOFbWgmKJT_siLqlmZFc-fhxFaQ5Mdtz1SDuZTnwd6P_GgpRJNmnDUDXSXWNA4ZWvwyvpC5IMU1J1fAjN9EQayxgNFCnmOvUMeScGUzq0y3eLpgLYbr3SL93ZIrdyMxWDoJ-v8dZd1XqYt46lSanl4WCwkHUvsFq34WQbVSwMXEQ',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD9Wsnj84UebVbOWYW8aChTcdEpCLjduYjSDQJUHS4CvIlLyJn8mvy5O1HOD0Ei5EKDn90WpFmK3VqOFbWgmKJT_siLqlmZFc-fhxFaQ5Mdtz1SDuZTnwd6P_GgpRJNmnDUDXSXWNA4ZWvwyvpC5IMU1J1fAjN9EQayxgNFCnmOvUMeScGUzq0y3eLpgLYbr3SL93ZIrdyMxWDoJ-v8dZd1XqYt46lSanl4WCwkHUvsFq34WQbVSwMXEQ'
    ],
    weights: ['100g', '250g', '500g'],
    weightPrices: {
      '100g': 129,
      '250g': 279,
      '500g': 519
    },
    rating: 4.8,
    reviewCount: 210,
    isBestseller: true,
    tagline: 'Zesty smoked bird-eye chili',
    nutritionalInfo: {
      calories: '365 kcal',
      protein: '9.5g',
      fiber: '13.9g',
      fat: '1.2g'
    },
    reviews: []
  },
  {
    id: 'heritage-tasting-box',
    name: 'Heritage Tasting Box',
    description: 'An elegant premium green gift pack featuring an assortment of our best-selling roasted and seasoned Makhanas.',
    price: 899,
    originalPrice: 999,
    category: 'Gift Packs',
    flavors: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXFR3KdlRMguX5dgzWG3eyPFsfcvuHZucWY5JywKIjSYUl1S9v-op5eetwjmwmKGJNB0u40qzyqH57ag26tMXA3BTXz_nQq6XQffo1QyMYIUnk-fScHsSv06qSF2c29zSfdIkJVbQxrBvpB5CB9PaRK_abV3ohv2lw0P__qKRpuMGJzI9E2pkgs-wFQSkliynI7KIgJGSF13K8mDedq8Vv9QjKqXS2GyF8HqDVi1Z3UBWK8j2be95PQ',
    galleryImages: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXFR3KdlRMguX5dgzWG3eyPFsfcvuHZucWY5JywKIjSYUl1S9v-op5eetwjmwmKGJNB0u40qzyqH57ag26tMXA3BTXz_nQq6XQffo1QyMYIUnk-fScHsSv06qSF2c29zSfdIkJVbQxrBvpB5CB9PaRK_abV3ohv2lw0P__qKRpuMGJzI9E2pkgs-wFQSkliynI7KIgJGSF13K8mDedq8Vv9QjKqXS2GyF8HqDVi1Z3UBWK8j2be95PQ'
    ],
    weights: ['1 Pack'],
    weightPrices: {
      '1 Pack': 899
    },
    rating: 4.9,
    reviewCount: 45,
    tagline: 'Exquisite festive gifting box',
    nutritionalInfo: {
      calories: 'N/A',
      protein: 'Mixed Pack',
      fiber: 'High Fiber',
      fat: 'Low Fat'
    },
    reviews: []
  }
];

export const countries = [
  'India',
  'United States',
  'United Kingdom',
  'UAE',
  'Australia',
  'Germany',
  'Canada',
  'Singapore'
];
