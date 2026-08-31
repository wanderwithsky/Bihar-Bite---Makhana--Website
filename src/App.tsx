import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import ShopScreen from './components/ShopScreen';
import DetailsScreen from './components/DetailsScreen';
import BulkScreen from './components/BulkScreen';
import ContactScreen from './components/ContactScreen';
import AboutScreen from './components/AboutScreen';
import OurStoryScreen from './components/OurStoryScreen';
import PrivacyPolicyScreen from './components/PrivacyPolicyScreen';
import TermsConditionsScreen from './components/TermsConditionsScreen';
import ShippingPolicyScreen from './components/ShippingPolicyScreen';
import ReturnRefundScreen from './components/ReturnRefundScreen';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutScreen from './components/CheckoutScreen';
import Footer from './components/Footer';
import Notification from './components/Notification';
import UserAuthScreen from './components/UserAuthScreen';
import AdminLoginScreen from './components/AdminLoginScreen';
import AdminLayout from './components/admin/AdminLayout';
import FAQScreen from './components/FAQScreen';
import ScrollToTop from './components/ScrollToTop';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import TrackOrderScreen from './components/TrackOrderScreen';
import AccountScreen from './components/AccountScreen';
import OrdersScreen from './components/OrdersScreen';
import { Product, CartItem, ScreenType, User, Order, Address } from './types';
import { 
  isSupabaseConfigured, 
  supabase, 
  fetchUserProfile, 
  createOrderInDb,
  submitContactMessage,
  submitNewsletterSubscriber,
  addProductToDb,
  updateProductInDb,
  deleteProductFromDb,
  fetchUserWishlist,
  addToUserWishlist,
  removeFromUserWishlist,
  fetchProducts,
  fetchAllOrders,
  fetchAllProfiles
} from './lib/supabase';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Adapter for components still expecting setScreen
  const setScreen = (screen: ScreenType) => {
    switch (screen) {
      case 'home': navigate('/'); break;
      case 'shop': navigate('/products'); break;
      case 'details': navigate('/details'); break;
      case 'bulk': navigate('/bulk'); break;
      case 'contact': navigate('/contact'); break;
      case 'about': navigate('/about'); break;
      case 'privacy-policy': navigate('/privacy-policy'); break;
      case 'terms-conditions': navigate('/terms-and-conditions'); break;
      case 'shipping-policy': navigate('/shipping-policy'); break;
      case 'return-refund': navigate('/return-refund-policy'); break;
      case 'faq': navigate('/faqs'); break;
      case 'track-order': navigate('/track-order'); break;
      case 'admin-login': navigate('/admin'); break;
      case 'admin-dashboard': navigate('/admin'); break;
      default: navigate('/'); break;
    }
  };
  const [selectedCategory, setSelectedCategory] = useState<Product['category'] | 'All'>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // E-commerce state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<{ product: Product, selectedWeight: string, quantity: number, price: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Global Toast Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- DYNAMIC DATABASE STATES ---
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Session states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<{ email: string; name: string } | null>(null);

  // Removed default seed data as per requirements

  // Load database structures on startup
  useEffect(() => {
    const loadStartupData = async () => {
      // 1. Fetch live products from Supabase
      if (isSupabaseConfigured && supabase) {
        setIsProductsLoading(true);
        setProductsError(null);
        try {
          const fetchedProducts = await fetchProducts();
          setCatalogProducts(fetchedProducts || []);
        } catch (err: any) {
          console.error('Failed to load products from Supabase:', err);
          setProductsError('Unable to load products. Please try again.');
        } finally {
          setIsProductsLoading(false);
        }
      } else {
        setIsProductsLoading(false);
        setProductsError('Database connection not configured.');
      }
      
      // 2. Fetch User Sessions (Profiles) from Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          const fetchedProfiles = await fetchAllProfiles();
          setUsers(fetchedProfiles as any); // cast for compat
        } catch (err) {
          console.error('Failed to load global profiles from Supabase:', err);
        }
      }
      // 3. Orders from Supabase
      if (isSupabaseConfigured && supabase) {
        try {
          const liveOrders = await fetchAllOrders();
          setOrders(liveOrders);
        } catch (err) {
          console.error('Failed to load global orders from Supabase:', err);
        }
      } else {
        const savedOrders = localStorage.getItem('bihar_bite_orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }
      }

      // 4. Restore Sessions (check Supabase session first, then fallback to local)
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
              setCurrentUser(profile);
              localStorage.setItem('bihar_bite_user_session', JSON.stringify(profile));
            }
          } else {
            const savedUserSession = localStorage.getItem('bihar_bite_user_session');
            if (savedUserSession) setCurrentUser(JSON.parse(savedUserSession));
          }
        } catch (err) {
          console.error('Error recovering Supabase user session:', err);
          const savedUserSession = localStorage.getItem('bihar_bite_user_session');
          if (savedUserSession) setCurrentUser(JSON.parse(savedUserSession));
        }
      } else {
        const savedUserSession = localStorage.getItem('bihar_bite_user_session');
        if (savedUserSession) setCurrentUser(JSON.parse(savedUserSession));
      }

      const savedAdminSession = localStorage.getItem('bihar_bite_admin_session');
      if (savedAdminSession) setCurrentAdmin(JSON.parse(savedAdminSession));
    };

    loadStartupData();
  }, []);

  // Custom event listener for components that don't have direct access to setIsWishlistOpen
  useEffect(() => {
    const handleOpenWishlist = () => setIsWishlistOpen(true);
    window.addEventListener('open-wishlist', handleOpenWishlist);
    return () => window.removeEventListener('open-wishlist', handleOpenWishlist);
  }, []);

  // Handle Auth Modal Body Scroll Lock and ESC Key
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsAuthModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isAuthModalOpen]);

  // Initialize cart from localStorage if available
  useEffect(() => {
    const savedCart = localStorage.getItem('bihar_bite_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
  }, []);

  // Sync wishlist from Supabase for authenticated users, or localStorage for guests
  useEffect(() => {
    const syncWishlist = async () => {
      if (currentUser) {
        // Authenticated user: fetch from DB
        const productIds = await fetchUserWishlist(currentUser.id);
        const mappedProducts = productIds
          .map(id => catalogProducts.find(p => p.id === id))
          .filter(Boolean) as Product[];
        setWishlist(mappedProducts);
      } else {
        // Guest user: load from localStorage
        const savedWishlist = localStorage.getItem('bihar_bite_wishlist');
        if (savedWishlist) {
          try {
            const parsed = JSON.parse(savedWishlist);
            if (Array.isArray(parsed)) {
              if (parsed.length > 0 && typeof parsed[0] === 'string') {
                const mappedProducts = parsed
                  .map(id => catalogProducts.find(p => p.id === id))
                  .filter(Boolean) as Product[];
                setWishlist(mappedProducts);
              } else {
                setWishlist(parsed);
              }
            }
          } catch (e) {}
        } else {
          setWishlist([]); // Clear if no guest wishlist
        }
      }
    };
    syncWishlist();
  }, [currentUser, catalogProducts]);

  // Save changes to localStorage
  useEffect(() => {
    safeLocalStorageSet('bihar_bite_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Store ONLY product IDs to prevent localStorage bloat and stale data
    // ONLY save to localStorage for guests. Authenticated users save to DB directly.
    if (!currentUser) {
      const wishlistIds = wishlist.map(p => p.id);
      safeLocalStorageSet('bihar_bite_wishlist', JSON.stringify(wishlistIds));
    }
  }, [wishlist, currentUser]);

  // DB Sync helper utilities
  const safeLocalStorageSet = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      // Quota exceeded or storage unavailable — this is just a local cache,
      // so failing here must never break the actual database save.
      console.warn(`Could not cache "${key}" to localStorage (likely quota exceeded):`, err);
    }
  };

  const persistProducts = (newProducts: Product[]) => {
    setCatalogProducts(newProducts);
    safeLocalStorageSet('bihar_bite_catalog', JSON.stringify(newProducts));
  };

  const persistUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    safeLocalStorageSet('bihar_bite_users', JSON.stringify(newUsers));
  };

  const persistOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    safeLocalStorageSet('bihar_bite_orders', JSON.stringify(newOrders));
  };

  // Show a notification toast helper
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
  };

  // Cart operations
  const handleAddToCart = (product: Product, selectedWeight: string, quantity = 1) => {
    const price = product.weightPrices[selectedWeight] || product.price;
    
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedWeight === selectedWeight
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, selectedWeight, quantity, price }];
      }
    });

    showToast(`Added ${quantity}x ${product.name} (${selectedWeight}) to basket!`, 'success');
  };

  const handleBuyNowInitiate = (product: Product, selectedWeight: string, quantity: number) => {
    const price = product.weightPrices?.[selectedWeight] || product.price;
    setBuyNowItem({ product, selectedWeight, quantity, price });
    navigate('/checkout');
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleUpdateQuantity = (productId: string, weight: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedWeight === weight
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, weight: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedWeight === weight))
    );
    showToast('Removed item from shopping cart.', 'success');
  };

  // Wishlist operations
  const handleToggleWishlist = async (product: Product) => {
    const isSaved = wishlist.some((item) => item.id === product.id);
    
    if (currentUser) {
      // Authenticated mutation
      try {
        if (isSaved) {
          await removeFromUserWishlist(currentUser.id, product.id);
          setWishlist(prev => prev.filter(item => item.id !== product.id));
          showToast('Removed flavor from wishlist.', 'success');
        } else {
          await addToUserWishlist(currentUser.id, product.id);
          setWishlist(prev => [...prev, product]);
          showToast('Saved flavor to your wishlist!', 'success');
        }
      } catch (err: any) {
        console.error('Wishlist update failed:', {
          code: err.code,
          message: err.message,
          details: err.details,
          hint: err.hint,
          err: err
        });
        showToast('Failed to update wishlist. Please try again.', 'error');
      }
    } else {
      // Guest mutation
      setWishlist((prev) => {
        if (isSaved) {
          return prev.filter((item) => item.id !== product.id);
        } else {
          return [...prev, product];
        }
      });
      
      if (isSaved) {
        showToast('Removed flavor from wishlist.', 'success');
      } else {
        showToast('Saved flavor to your wishlist!', 'success');
      }
    }
  };

  const handleMoveToCart = (product: Product) => {
    const defaultWeight = product.weights[0];
    handleAddToCart(product, defaultWeight, 1);
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
  };

  // Unified Checkout Handler for both Cart and Buy Now flows
  const handleUnifiedOrderSuccess = async (details: { name: string; email: string; phone: string; address: string, saveAddress?: boolean, paymentMethod?: 'cod' | 'online', isInitiation?: boolean }): Promise<Order | void> => {
    const sourceItems = buyNowItem 
      ? [{
          productId: buyNowItem.product.id,
          name: buyNowItem.product.name,
          quantity: buyNowItem.quantity,
          weight: buyNowItem.selectedWeight,
          price: buyNowItem.price
        }]
      : cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          weight: item.selectedWeight,
          price: item.price
        }));

    if (sourceItems.length === 0) return;

    const totalCost = sourceItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const finalTotal = totalCost >= 999 ? totalCost : totalCost + 49;

    let savedAddressAdded = false;
    let updatedProfile = currentUser;

    if (currentUser && details.saveAddress) {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        fullName: details.name,
        mobile: details.phone,
        streetAddress: details.address,
        city: 'Extracted from address',
        state: 'Extracted from address',
        pincode: '000000',
        isDefault: false
      };
      updatedProfile = {
        ...currentUser,
        savedAddresses: [...(currentUser.savedAddresses || []), newAddress]
      };
      savedAddressAdded = true;
    }

    const now = new Date();
    const orderDate = now.toISOString().split('T')[0];
    const orderTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() + 10);
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + 12);
    
    const deliveryStartDate = startDate.toISOString().split('T')[0];
    const deliveryEndDate = endDate.toISOString().split('T')[0];

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: orderDate,
      time: orderTime,
      status: 'Pending',
      total: finalTotal,
      subtotal: totalCost,
      shippingCharge: finalTotal - totalCost,
      customerName: details.name,
      customerEmail: details.email,
      customerMobile: details.phone,
      shippingAddress: details.address,
      items: sourceItems,
      paymentMethod: details.paymentMethod || 'cod',
      paymentStatus: 'Pending', // Initially always Pending until verification
      deliveryStartDate,
      deliveryEndDate,
      customerId: currentUser ? currentUser.id : null
    };

    if (isSupabaseConfigured) {
      try {
        let newDbOrder: Order = await createOrderInDb(
          currentUser ? currentUser.id : null,
          details.name,
          details.email,
          details.phone,
          details.address,
          finalTotal,
          sourceItems,
          details.paymentMethod || 'cod',
          'Pending' // always pending initially
        );
        newDbOrder = { ...newOrder, ...newDbOrder }; // merge to keep local fields

        // Update current user state if they are registered
        if (currentUser && updatedProfile) {
          updatedProfile = {
            ...updatedProfile,
            orderHistory: [newDbOrder, ...(updatedProfile.orderHistory || [])]
          };
          setCurrentUser(updatedProfile);
          localStorage.setItem('bihar_bite_user_session', JSON.stringify(updatedProfile));
          
          const updatedUsers = users.map(u => u.id === updatedProfile?.id ? updatedProfile : u);
          persistUsers(updatedUsers);
        }
        
        setOrders(prev => [newDbOrder, ...prev]);

        if (details.isInitiation) {
          // If just initiating (Online Payment), stop here. Return the order.
          return newDbOrder;
        }

        // For COD, finish the process immediately
        if (buyNowItem) setBuyNowItem(null);
        else setCart([]);
        showToast('Secure Order placed successfully!', 'success');

        // Trigger order confirmation notifications (Fire and Forget)
        try {
          const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
          fetch(`${baseUrl}/api/notifications/order-confirmation`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order: newDbOrder })
          }).catch(err => console.error('Failed to trigger notifications:', err));
        } catch (err) {
          console.error('Notification dispatch error:', err);
        }

        return newDbOrder;
      } catch (err: any) {
        console.error('Supabase order creation failed:', err);
        showToast(`Checkout failed: ${err.message}`, 'error');
        throw new Error(err.message); // Stop checkout process and propagate to caller
      }
    }

    // Completely offline fallback (only triggers if isSupabaseConfigured is somehow false)
    const updatedOrders = [newOrder, ...orders];
    persistOrders(updatedOrders);

    if (updatedProfile && updatedProfile.email.toLowerCase() === details.email.toLowerCase()) {
      updatedProfile = {
        ...updatedProfile,
        orderHistory: [newOrder, ...(updatedProfile.orderHistory || [])]
      };
      setCurrentUser(updatedProfile);
      localStorage.setItem('bihar_bite_user_session', JSON.stringify(updatedProfile));
    }

    const updatedUsers = users.map(user => {
      if (user.email.toLowerCase() === details.email.toLowerCase()) {
        if (updatedProfile && user.id === updatedProfile.id) return updatedProfile;
        return {
          ...user,
          orderHistory: [newOrder, ...user.orderHistory]
        };
      }
      return user;
    });
    persistUsers(updatedUsers);

    if (details.isInitiation) {
      return newOrder;
    }

    if (buyNowItem) setBuyNowItem(null);
    else setCart([]);
    showToast('Secure Order placed successfully!', 'success');
    return newOrder;
  };

  const handleOnlinePaymentVerified = (order: Order) => {
    // 1. Update local order state to Paid
    const updatedOrder = { ...order, paymentStatus: 'Paid' };
    setOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    
    // 2. Clear cart
    if (buyNowItem) setBuyNowItem(null);
    else setCart([]);
    showToast('Secure Order placed successfully!', 'success');

    // 3. Trigger notification
    try {
      const baseUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      fetch(`${baseUrl}/api/notifications/order-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: updatedOrder })
      }).catch(err => console.error('Failed to trigger notifications:', err));
    } catch (err) {
      console.error('Notification dispatch error:', err);
    }
  };

  // Newsletter subscription
  const handleSubscribe = async (email: string) => {
    try {
      await submitNewsletterSubscriber(email);
      showToast(`Successfully subscribed ${email} to newsletters!`, 'success');
    } catch (err: any) {
      showToast(`Subscription failed: ${err.message || err}`, 'error');
    }
  };

  // Wholesale / inquiry flow
  const handleInquirySubmit = async (details: any) => {
    try {
      const countryVal = details.country || 'India';
      const isExport = countryVal.toLowerCase() !== 'india';
      const inquiryType = isExport ? 'Export Inquiry' : 'Bulk Wholesale';

      const fullMessage = `Company: ${details.company}
Country: ${countryVal}
Business Type: ${details.type}
Target Volume: ${details.quantity} kg

Message: ${details.message}`;

      await submitContactMessage({
        fullName: details.name,
        email: details.email,
        phone: details.phone || '',
        inquiryType: inquiryType,
        message: fullMessage,
        subscribeNewsletter: false
      });
      showToast(`Bulk wholesale inquiry from ${details.name} logged securely!`, 'success');
    } catch (err: any) {
      showToast(`Wholesale inquiry submit failed: ${err.message || err}`, 'error');
      throw err;
    }
  };

  const handleContactSubmit = async (details: {
    name: string;
    email: string;
    phone?: string;
    inquiryType?: string;
    message: string;
    subscribeNewsletter?: boolean;
  }) => {
    // This must return the promise to propagate potential errors to ContactScreen
    await submitContactMessage({
      fullName: details.name,
      email: details.email,
      phone: details.phone,
      inquiryType: details.inquiryType,
      message: details.message,
      subscribeNewsletter: details.subscribeNewsletter
    });

    showToast(`Thank you, ${details.name}! Your message was securely logged.`, 'success');

    if (details.subscribeNewsletter) {
      try {
        await submitNewsletterSubscriber(details.email);
      } catch (newsletterErr) {
        console.warn('Newsletter subscription during contact failed silently:', newsletterErr);
      }
    }
  };

  const handleSearchSubmit = () => {
    navigate('/products');
  };

  // --- REGULAR USER SIGN IN / REGISTER FLOWS ---
  const handleUserLogin = (emailOrUser: string | User) => {
    if (typeof emailOrUser === 'object') {
      const userObj = emailOrUser;
      setCurrentUser(userObj);
      localStorage.setItem('bihar_bite_user_session', JSON.stringify(userObj));
      showToast(`Welcome back, ${userObj.fullName}!`, 'success');
      navigate('/');
      return;
    }

    const email = emailOrUser;
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.mobile === email);
    
    if (!existing) {
      showToast('No user found with these details. Please Register.', 'error');
      return;
    }

    if (existing.status === 'Suspended') {
      showToast('This account has been suspended. Please contact coordinator support.', 'error');
      return;
    }

    setCurrentUser(existing);
    localStorage.setItem('bihar_bite_user_session', JSON.stringify(existing));
    showToast(`Welcome back, ${existing.fullName}!`, 'success');
    navigate('/');
  };

  const handleUserRegister = (fullNameOrUser: string | User, email?: string, mobile?: string) => {
    if (typeof fullNameOrUser === 'object') {
      const userObj = fullNameOrUser;
      setCurrentUser(userObj);
      localStorage.setItem('bihar_bite_user_session', JSON.stringify(userObj));
      showToast('Registration complete. Welcome to Bihar Bite!', 'success');
      navigate('/');
      return;
    }

    const fullName = fullNameOrUser;
    const alreadyExists = users.some(u => u.email.toLowerCase() === email!.toLowerCase());
    if (alreadyExists) {
      showToast('An account with this email already exists.', 'error');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      fullName,
      email: email!,
      mobile: mobile!,
      status: 'Active',
      dateRegistered: new Date().toISOString().split('T')[0],
      orderHistory: []
    };

    const updated = [...users, newUser];
    persistUsers(updated);
    setCurrentUser(newUser);
    localStorage.setItem('bihar_bite_user_session', JSON.stringify(newUser));
    showToast('Registration complete. Welcome to Bihar Bite!', 'success');
    navigate('/');
  };

  const handleUserLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
    setCurrentUser(null);
    setCurrentAdmin(null);
    localStorage.removeItem('bihar_bite_user_session');
    localStorage.removeItem('bihar_bite_admin_session');
    showToast('Signed out of terminal safely.', 'success');
    navigate('/');
  };

  // --- ADMIN PORTAL LOGIN / CONTROLS ---
  const handleAdminLogin = (email: string, name: string) => {
    const session = { email, name };
    setCurrentAdmin(session);
    localStorage.setItem('bihar_bite_admin_session', JSON.stringify(session));
    navigate('/admin');
  };

  const handleAddProduct = async (newProduct: Product) => {
    try {
      const saved = await addProductToDb(newProduct);
      const updated = [saved, ...catalogProducts];
      persistProducts(updated);
      showToast(`Product "${saved.name}" successfully launched!`, 'success');
    } catch (err: any) {
      console.error('Failed to add product to Supabase:', err);
      showToast(`Failed to save product to database: ${err.message || err}`, 'error');
      throw err;
    }
  };

  const handleEditProduct = async (updatedProduct: Product) => {
    try {
      const saved = await updateProductInDb(updatedProduct);
      const updated = catalogProducts.map(p => p.id === saved.id ? saved : p);
      persistProducts(updated);
      showToast(`Product "${saved.name}" updated successfully!`, 'success');
    } catch (err: any) {
      console.error('Failed to update product in Supabase:', err);
      showToast(`Failed to update product in database: ${err.message || err}`, 'error');
      throw err;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const target = catalogProducts.find(p => p.id === productId);
    try {
      await deleteProductFromDb(productId);
      const updated = catalogProducts.filter(p => p.id !== productId);
      persistProducts(updated);
      showToast(`Listing "${target?.name || productId}" successfully withdrawn.`, 'success');
    } catch (err: any) {
      console.error('Failed to delete product in Supabase:', err);
      showToast(`Failed to delete product from database: ${err.message || err}`, 'error');
      throw err;
    }
  };

  const handleUpdateUserStatus = (userId: string, status: 'Active' | 'Suspended') => {
    const updated = users.map(u => {
      if (u.id === userId) {
        // If suspended user is currently logged in, force kick
        if (currentUser && currentUser.id === userId && status === 'Suspended') {
          setCurrentUser(null);
          localStorage.removeItem('bihar_bite_user_session');
          showToast('Account suspended. Active session revoked.', 'error');
        }
        return { ...u, status };
      }
      return u;
    });
    persistUsers(updated);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    // Global orders update
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    persistOrders(updatedOrders);

    // Sync back to users database histories
    const targetOrder = updatedOrders.find(o => o.id === orderId);
    if (targetOrder) {
      const updatedUsers = users.map(u => {
        if (u.email.toLowerCase() === targetOrder.customerEmail.toLowerCase()) {
          const revisedHistory = (u.orderHistory || []).map(oh => oh.id === orderId ? { ...oh, status } : oh);
          return { ...u, orderHistory: revisedHistory };
        }
        return u;
      });
      persistUsers(updatedUsers);

      // Sync active profile session
      if (currentUser && currentUser.email.toLowerCase() === targetOrder.customerEmail.toLowerCase()) {
        const revisedHistory = (currentUser.orderHistory || []).map(oh => oh.id === orderId ? { ...oh, status } : oh);
        const revisedProfile = { ...currentUser, orderHistory: revisedHistory };
        setCurrentUser(revisedProfile);
        localStorage.setItem('bihar_bite_user_session', JSON.stringify(revisedProfile));
      }
    }
  };

  const isAdminScreen = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans selection:bg-secondary-container selection:text-on-secondary-container antialiased">
      <ScrollToTop />
      
      {/* Header element (storefront only — admin has its own dedicated header) */}
      {!isAdminScreen && (
        <Header
          currentScreen={'home'} // Kept for type compatibility temporarily
          setScreen={setScreen}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setSelectedProduct={setSelectedProduct}
          cart={cart}
          setIsCartOpen={setIsCartOpen}
          wishlist={wishlist}
          setIsWishlistOpen={setIsWishlistOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
          currentUser={currentUser}
          currentAdmin={currentAdmin}
          onLogout={handleUserLogout}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* Main app screens section */}
      <main className="flex-grow">
        {isAdminScreen ? (
          <Routes>
            <Route path="/admin" element={
              currentAdmin ? (
                <AdminLayout
                  products={catalogProducts}
                  onAddProduct={handleAddProduct}
                  onEditProduct={handleEditProduct}
                  onDeleteProduct={handleDeleteProduct}
                  users={users}
                  onUpdateUserStatus={handleUpdateUserStatus}
                  orders={orders}
                  onUpdateOrderStatus={handleUpdateOrderStatus}
                  setScreen={setScreen}
                  onLogout={handleUserLogout}
                  showToast={showToast}
                  adminName={currentAdmin.name}
                  adminEmail={currentAdmin.email}
                />
              ) : (
                <AdminLoginScreen
                  onAdminLogin={handleAdminLogin}
                  setScreen={setScreen}
                  showToast={showToast}
                />
              )
            } />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={
              <HomeScreen
                setScreen={setScreen}
                setSelectedCategory={setSelectedCategory}
                setSelectedProduct={setSelectedProduct}
                products={catalogProducts}
                isProductsLoading={isProductsLoading}
                productsError={productsError}
                onSubmitContact={handleContactSubmit}
              />
            } />

            <Route path="/products" element={
              <ShopScreen
                setScreen={setScreen}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSelectedProduct={setSelectedProduct}
                products={catalogProducts}
                isProductsLoading={isProductsLoading}
                productsError={productsError}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                searchQuery={searchQuery}
              />
            } />

            <Route path="/details" element={<Navigate to="/products" replace />} />
            
            <Route path="/product/:slug" element={
              <DetailsScreen
                setScreen={setScreen}
                product={selectedProduct as any} // Keeping to satisfy old type temporarily, but will be ignored
                setSelectedProduct={setSelectedProduct}
                products={catalogProducts}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                setNotification={setNotification}
                onBuyNowAuthFlow={handleBuyNowInitiate}
                currentUser={currentUser}
                setIsCartOpen={setIsCartOpen}
              />
            } />

            <Route path="/checkout" element={
              <CheckoutScreen 
                buyNowItem={buyNowItem}
                cart={cart}
                onOrderSuccess={handleUnifiedOrderSuccess}
                onPaymentVerified={handleOnlinePaymentVerified}
                currentUser={currentUser}
                setScreen={setScreen}
                onClose={() => { setBuyNowItem(null); navigate(-1); }}
              />
            } />

            <Route path="/bulk" element={<BulkScreen onSubmitInquiry={handleInquirySubmit} />} />
            <Route path="/contact" element={<ContactScreen onSubmitContact={handleContactSubmit} />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/our-story" element={<OurStoryScreen />} />
            
            <Route path="/privacy-policy" element={<PrivacyPolicyScreen setScreen={setScreen} />} />
            <Route path="/terms-conditions" element={<TermsConditionsScreen setScreen={setScreen} />} />
            <Route path="/terms-and-conditions" element={<Navigate to="/terms-conditions" replace />} />
            <Route path="/shipping-policy" element={<ShippingPolicyScreen setScreen={setScreen} />} />
            <Route path="/return-refund-policy" element={<ReturnRefundScreen setScreen={setScreen} />} />
            <Route path="/faqs" element={<FAQScreen setScreen={setScreen} />} />
            <Route path="/track-order" element={<TrackOrderScreen setScreen={setScreen} orders={orders} />} />
            
            <Route path="/account" element={
              <AccountScreen 
                currentUser={currentUser} 
                onUpdateUser={setCurrentUser}
                onLogout={handleUserLogout}
                wishlistProducts={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                orders={orders.filter(o => o.customerEmail === currentUser?.email || o.customerMobile === currentUser?.mobile)}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            } />
            <Route path="/account/orders" element={
              <OrdersScreen 
                currentUser={currentUser}
                orders={orders.filter(o => o.customerEmail === currentUser?.email || o.customerMobile === currentUser?.mobile)}
                onOpenAuthModal={() => setIsAuthModalOpen(true)}
              />
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      {/* Side drawers & overlay modals */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[9998] flex items-center justify-center pointer-events-auto"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)' }}
            onClick={closeAuthModal}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FDFBF7] w-[calc(100vw-48px)] md:w-[calc(100vw-100px)] max-w-[1180px] max-h-[calc(100vh-48px)] md:max-h-[calc(100vh-100px)] overflow-hidden rounded-[32px] md:rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 relative flex flex-col shrink-0 z-[9999]"
            >
                <button
                  onClick={closeAuthModal}
                  className="absolute top-6 right-6 z-50 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5 text-stone-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              <div className="flex-1 w-full overflow-hidden relative">
                <UserAuthScreen
                  currentUser={currentUser}
                  onLogin={(emailOrUser) => {
                    handleUserLogin(emailOrUser);
                    setIsAuthModalOpen(false);
                  }}
                  onRegister={(fullNameOrUser, email, mobile) => {
                    handleUserRegister(fullNameOrUser, email, mobile);
                    setIsAuthModalOpen(false);
                  }}
                  onLogout={handleUserLogout}
                  setScreen={setScreen}
                  showToast={showToast}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setIsCartOpen(false);
          navigate('/checkout');
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveToCart}
      />

      {/* Global alert toaster notifications */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Footer element (storefront only) */}
      {!isAdminScreen && (
        <Footer setScreen={setScreen} onSubscribe={handleSubscribe} />
      )}

      {/* WhatsApp Floating Button (storefront only) */}
      {!isAdminScreen && <FloatingWhatsAppButton />}
    </div>
  );
}