export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // base price for standard weight
  originalPrice?: number;
  category: 'Plain' | 'Roasted' | 'Flavoured' | 'Premium' | 'Gift Packs';
  flavors: string[];
  image: string;
  galleryImages: string[];
  weights: string[]; // e.g. ["100g", "250g", "500g", "1kg"]
  weightPrices: { [weight: string]: number }; // weight to price mapping
  rating: number;
  reviewCount: number;
  reviews: Review[];
  isBestseller?: boolean;
  isNew?: boolean;
  amazonUrl?: string;
  stock?: number;
  tagline?: string;
  nutritionalInfo?: {
    calories: string;
    protein: string;
    fiber: string;
    fat: string;
  };
}

export interface CartItem {
  product: Product;
  selectedWeight: string;
  quantity: number;
  price: number;
}

export interface Inquiry {
  fullName: string;
  companyName: string;
  country: string;
  inquiryType: string;
  quantityNeeded: number;
  message: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  weight: string;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Cancelled' | 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  total: number;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerMobile?: string;
  shippingAddress: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  status: 'Active' | 'Suspended';
  dateRegistered: string;
  orderHistory: Order[];
  savedAddresses?: string[];
}

export type ScreenType = 'home' | 'shop' | 'details' | 'bulk' | 'contact' | 'about' | 'blog' | 'privacy-policy' | 'terms-conditions' | 'shipping-policy' | 'return-refund' | 'auth' | 'admin-login' | 'admin-dashboard' | 'faq' | 'track-order' | 'account' | 'orders';