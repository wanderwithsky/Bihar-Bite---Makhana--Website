import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import ShopScreen from './components/ShopScreen';
import DetailsScreen from './components/DetailsScreen';
import BulkScreen from './components/BulkScreen';
import ContactScreen from './components/ContactScreen';
import AboutScreen from './components/AboutScreen';
import BlogScreen from './components/BlogScreen';
import PrivacyPolicyScreen from './components/PrivacyPolicyScreen';
import TermsConditionsScreen from './components/TermsConditionsScreen';
import ShippingPolicyScreen from './components/ShippingPolicyScreen';
import ReturnRefundScreen from './components/ReturnRefundScreen';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import Footer from './components/Footer';
import Notification from './components/Notification';
import UserAuthScreen from './components/UserAuthScreen';
import AdminLoginScreen from './components/AdminLoginScreen';
import AdminLayout from './components/admin/AdminLayout';
import FAQScreen from './components/FAQScreen';
import TrackOrderScreen from './components/TrackOrderScreen';
import { Product, CartItem, ScreenType, User, Order } from './types';
import { 
  isSupabaseConfigured, 
  fetchProducts, 
  supabase, 
  fetchUserProfile, 
  createOrderInDb,
  submitContactMessage,
  submitNewsletterSubscriber,
  addProductToDb,
  updateProductInDb,
  deleteProductFromDb
} from './lib/supabase';

export default function App() {
  const [currentScreen, setScreen] = useState<ScreenType>(() =>
    window.location.pathname.startsWith('/admin') ? 'admin-dashboard' : 'home'
  );
  const [selectedCategory, setSelectedCategory] = useState<Product['category'] | 'All'>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // E-commerce state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Global Toast Notifications
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- DYNAMIC DATABASE STATES ---
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Session states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<{ email: string; name: string } | null>(null);

  // Default seed values for demonstration
  const defaultUsers: User[] = [
    {
      id: 'usr-1',
      fullName: 'Aarav Sharma',
      email: 'aarav@sharma.com',
      mobile: '9876543210',
      status: 'Active',
      dateRegistered: '2026-06-15',
      orderHistory: []
    },
    {
      id: 'usr-2',
      fullName: 'Priya Patel',
      email: 'priya@patel.com',
      mobile: '8765432109',
      status: 'Active',
      dateRegistered: '2026-07-02',
      orderHistory: []
    },
    {
      id: 'usr-3',
      fullName: 'Deepak Mishra',
      email: 'deepak@mishra.com',
      mobile: '7654321098',
      status: 'Suspended',
      dateRegistered: '2026-05-10',
      orderHistory: []
    }
  ];

  const defaultOrders: Order[] = [
    {
      id: 'ORD-8924',
      date: '2026-07-10',
      status: 'Completed',
      total: 1047,
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav@sharma.com',
      customerMobile: '9876543210',
      shippingAddress: 'Flat 402, Ganga Heights, Boring Road, Patna - 800001',
      items: [
        { productId: 'himalayan-pink-salt', name: 'Himalayan Pink Salt Roasted', quantity: 2, weight: '250g', price: 349 },
        { productId: 'aged-cheddar-herb', name: 'Aged Cheddar & Herb', quantity: 1, weight: '250g', price: 389 }
      ]
    },
    {
      id: 'ORD-9431',
      date: '2026-07-15',
      status: 'Pending',
      total: 389,
      customerName: 'Priya Patel',
      customerEmail: 'priya@patel.com',
      customerMobile: '8765432109',
      shippingAddress: 'Sector 4, Bokaro Steel City, Bokaro - 827004',
      items: [
        { productId: 'aged-cheddar-herb', name: 'Aged Cheddar & Herb', quantity: 1, weight: '250g', price: 389 }
      ]
    },
    {
      id: 'ORD-4819',
      date: '2026-07-16',
      status: 'Cancelled',
      total: 349,
      customerName: 'Deepak Mishra',
      customerEmail: 'deepak@mishra.com',
      customerMobile: '7654321098',
      shippingAddress: 'Mithila Sadan, Darbhanga Road, Muzaffarpur - 842001',
      items: [
        { productId: 'himalayan-pink-salt', name: 'Himalayan Pink Salt Roasted', quantity: 1, weight: '250g', price: 349 }
      ]
    }
  ];

  // Map respective histories on load
  defaultUsers[0].orderHistory = [defaultOrders[0]];
  defaultUsers[2].orderHistory = [defaultOrders[2]];

  // Load database structures on startup
  useEffect(() => {
    const loadStartupData = async () => {
      // 1. Products (fetch dynamically from Supabase)
      setProductsLoading(true);
      setProductsError(null);
      try {
        const fetched = await fetchProducts();
        if (fetched && fetched.length > 0) {
          setCatalogProducts(fetched);
          try {
            localStorage.setItem('bihar_bite_catalog', JSON.stringify(fetched));
          } catch (cacheErr) {
            console.warn('Could not cache products to localStorage (likely quota exceeded):', cacheErr);
          }
        } else {
          setCatalogProducts([]);
          setProductsError('No active products found in the database catalog.');
        }
      } catch (err: any) {
        console.error('Failed to load products from Supabase:', err);
        setProductsError(err.message || 'Failed to connect to the database catalog.');
        const savedProducts = localStorage.getItem('bihar_bite_catalog');
        if (savedProducts) {
          setCatalogProducts(JSON.parse(savedProducts));
        } else {
          setCatalogProducts([]);
        }
      } finally {
        setProductsLoading(false);
      }

      // 2. Users fallback
      const savedUsers = localStorage.getItem('bihar_bite_users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        setUsers(defaultUsers);
        localStorage.setItem('bihar_bite_users', JSON.stringify(defaultUsers));
      }

      // 3. Orders fallback
      const savedOrders = localStorage.getItem('bihar_bite_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      } else {
        setOrders(defaultOrders);
        localStorage.setItem('bihar_bite_orders', JSON.stringify(defaultOrders));
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

  // Keep the browser URL in sync with admin vs. storefront screens, so the
  // admin panel is only reachable by visiting /admin directly.
  useEffect(() => {
    const isAdminScreen = currentScreen === 'admin-login' || currentScreen === 'admin-dashboard';
    const desiredPath = isAdminScreen ? '/admin' : '/';
    if (window.location.pathname !== desiredPath) {
      window.history.pushState({}, '', desiredPath);
    }
  }, [currentScreen]);

  useEffect(() => {
    const handlePopState = () => {
      setScreen(window.location.pathname.startsWith('/admin') ? 'admin-dashboard' : 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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

  // Initialize cart & wishlist from localStorage if available
  useEffect(() => {
    const savedCart = localStorage.getItem('bihar_bite_cart');
    const savedWishlist = localStorage.getItem('bihar_bite_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('bihar_bite_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bihar_bite_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

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
  const handleToggleWishlist = (product: Product) => {
    const isSaved = wishlist.some((item) => item.id === product.id);
    if (isSaved) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast('Removed flavor from wishlist.', 'success');
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast('Saved flavor to your wishlist!', 'success');
    }
  };

  const handleMoveToCart = (product: Product) => {
    const defaultWeight = product.weights[0];
    handleAddToCart(product, defaultWeight, 1);
    setWishlist((prev) => prev.filter((item) => item.id !== product.id));
  };

  // Checkout flows (Creates a real transaction order dynamically!)
  const handleOrderSuccess = async (details: { name: string; email: string; phone: string; address: string }) => {
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      weight: item.selectedWeight,
      price: item.price
    }));

    const totalCost = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const finalTotal = totalCost >= 999 ? totalCost : totalCost + 49;

    // Use Supabase database if configured and user is logged in
    if (isSupabaseConfigured && currentUser) {
      try {
        const newDbOrder = await createOrderInDb(
          currentUser.id,
          details.name,
          details.email,
          details.phone,
          details.address,
          finalTotal,
          orderItems
        );

        // Sync local states
        const updatedProfile = {
          ...currentUser,
          orderHistory: [newDbOrder, ...currentUser.orderHistory]
        };
        setCurrentUser(updatedProfile);
        localStorage.setItem('bihar_bite_user_session', JSON.stringify(updatedProfile));
        
        setOrders(prev => [newDbOrder, ...prev]);
        setCart([]);
        showToast('Secure Order placed successfully via Supabase! Check your profile history.', 'success');
        return;
      } catch (err: any) {
        console.error('Supabase order creation failed, trying local fallback:', err);
        showToast(`Supabase order failed: ${err.message}. Saving locally...`, 'error');
      }
    }

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      total: finalTotal,
      customerName: details.name,
      customerEmail: details.email,
      customerMobile: details.phone,
      shippingAddress: details.address,
      items: orderItems
    };

    // 1. Add order to system list
    const updatedOrders = [newOrder, ...orders];
    persistOrders(updatedOrders);

    // 2. Append history to matching registered user by email (if exists)
    const updatedUsers = users.map(user => {
      if (user.email.toLowerCase() === details.email.toLowerCase()) {
        return {
          ...user,
          orderHistory: [newOrder, ...user.orderHistory]
        };
      }
      return user;
    });
    persistUsers(updatedUsers);

    // 3. Sync logged in session state
    if (currentUser && currentUser.email.toLowerCase() === details.email.toLowerCase()) {
      const updatedProfile = {
        ...currentUser,
        orderHistory: [newOrder, ...currentUser.orderHistory]
      };
      setCurrentUser(updatedProfile);
      localStorage.setItem('bihar_bite_user_session', JSON.stringify(updatedProfile));
    }

    setCart([]);
    showToast('Secure Order placed successfully! Check your profile history.', 'success');
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
    setScreen('shop');
  };

  // --- REGULAR USER SIGN IN / REGISTER FLOWS ---
  const handleUserLogin = (emailOrUser: string | User) => {
    if (typeof emailOrUser === 'object') {
      const userObj = emailOrUser;
      setCurrentUser(userObj);
      localStorage.setItem('bihar_bite_user_session', JSON.stringify(userObj));
      showToast(`Welcome back, ${userObj.fullName}!`, 'success');
      setScreen('home');
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
    setScreen('home');
  };

  const handleUserRegister = (fullNameOrUser: string | User, email?: string, mobile?: string) => {
    if (typeof fullNameOrUser === 'object') {
      const userObj = fullNameOrUser;
      setCurrentUser(userObj);
      localStorage.setItem('bihar_bite_user_session', JSON.stringify(userObj));
      showToast('Registration complete. Welcome to Bihar Bite!', 'success');
      setScreen('home');
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
    setScreen('home');
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
    setScreen('home');
  };

  // --- ADMIN PORTAL LOGIN / CONTROLS ---
  const handleAdminLogin = (email: string, name: string) => {
    const session = { email, name };
    setCurrentAdmin(session);
    localStorage.setItem('bihar_bite_admin_session', JSON.stringify(session));
    setScreen('admin-dashboard');
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
          const revisedHistory = u.orderHistory.map(oh => oh.id === orderId ? { ...oh, status } : oh);
          return { ...u, orderHistory: revisedHistory };
        }
        return u;
      });
      persistUsers(updatedUsers);

      // Sync active profile session
      if (currentUser && currentUser.email.toLowerCase() === targetOrder.customerEmail.toLowerCase()) {
        const revisedHistory = currentUser.orderHistory.map(oh => oh.id === orderId ? { ...oh, status } : oh);
        const revisedProfile = { ...currentUser, orderHistory: revisedHistory };
        setCurrentUser(revisedProfile);
        localStorage.setItem('bihar_bite_user_session', JSON.stringify(revisedProfile));
      }
    }
  };

  const isAdminScreen = currentScreen === 'admin-login' || currentScreen === 'admin-dashboard';

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-sans selection:bg-secondary-container selection:text-on-secondary-container antialiased">
      
      {/* Header element (storefront only — admin has its own dedicated header) */}
      {!isAdminScreen && (
        <Header
          currentScreen={currentScreen}
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
          <>
            {currentScreen === 'admin-login' && (
              <AdminLoginScreen
                onAdminLogin={handleAdminLogin}
                setScreen={setScreen}
                showToast={showToast}
              />
            )}

            {currentScreen === 'admin-dashboard' && (
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
            )}
          </>
        ) : productsLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] pt-[180px] px-6">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-[#7C8464]/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-[#7C8464] border-r-[#7C8464]/40 rounded-full animate-spin"></div>
            </div>
            <p className="font-serif italic text-primary text-lg animate-pulse text-[#4A4A3A]">Sourcing the finest Fox Nuts...</p>
            <p className="text-xs text-on-surface-variant/60 mt-1">Authentic Bihar heritage is worth the wait</p>
          </div>
        ) : productsError && catalogProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] pt-[180px] px-6 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-primary mb-2">Temporary Connection Issue</h3>
            <p className="text-sm text-on-surface-variant mb-6">{productsError}</p>
            <button 
              onClick={() => {
                const retryFetch = async () => {
                  setProductsLoading(true);
                  setProductsError(null);
                  try {
                    const fetched = await fetchProducts();
                    if (fetched && fetched.length > 0) {
                      setCatalogProducts(fetched);
                    } else {
                      setProductsError('No active products found.');
                    }
                  } catch (err: any) {
                    setProductsError(err.message || 'Database connection error.');
                  } finally {
                    setProductsLoading(false);
                  }
                };
                retryFetch();
              }}
              className="bg-primary text-white px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {currentScreen === 'home' && (
              <HomeScreen
                setScreen={setScreen}
                setSelectedCategory={setSelectedCategory}
                setSelectedProduct={setSelectedProduct}
                products={catalogProducts}
              />
            )}

            {currentScreen === 'shop' && (
              <ShopScreen
                setScreen={setScreen}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                setSelectedProduct={setSelectedProduct}
                products={catalogProducts}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                searchQuery={searchQuery}
              />
            )}

            {currentScreen === 'details' && selectedProduct && (
              <DetailsScreen
                setScreen={setScreen}
                product={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                products={catalogProducts}
                wishlist={wishlist}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            )}

            {currentScreen === 'bulk' && (
              <BulkScreen onSubmitInquiry={handleInquirySubmit} />
            )}

            {currentScreen === 'contact' && (
              <ContactScreen onSubmitContact={handleContactSubmit} />
            )}

            {currentScreen === 'about' && (
              <AboutScreen />
            )}

            {currentScreen === 'blog' && (
              <BlogScreen />
            )}

            {currentScreen === 'privacy-policy' && (
              <PrivacyPolicyScreen setScreen={setScreen} />
            )}

            {currentScreen === 'terms-conditions' && (
              <TermsConditionsScreen setScreen={setScreen} />
            )}

            {currentScreen === 'shipping-policy' && (
              <ShippingPolicyScreen setScreen={setScreen} />
            )}

            {currentScreen === 'return-refund' && (
              <ReturnRefundScreen setScreen={setScreen} />
            )}

            {currentScreen === 'faq' && (
              <FAQScreen setScreen={setScreen} />
            )}

            {currentScreen === 'track-order' && (
              <TrackOrderScreen setScreen={setScreen} orders={orders} />
            )}

            {/* Removed inline auth screen */}
          </>
        )}
      </main>

      {/* Side drawers & overlay modals */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-auto"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(16px)' }}
            onClick={() => setIsAuthModalOpen(false)}
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FDFBF7] w-full md:w-[1080px] h-[90vh] md:h-[640px] max-w-[100vw] md:max-w-[90vw] md:max-h-[88vh] overflow-hidden rounded-t-[32px] md:rounded-[32px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-white/20 relative flex flex-col"
            >
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-6 right-6 z-50 w-10 h-10 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
              <div className="flex-1 w-full overflow-hidden relative">
                <UserAuthScreen
                  currentUser={currentUser}
                  onLogin={(emailOrUser, fullName, mobile) => {
                    handleUserLogin(emailOrUser, fullName, mobile);
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
          setIsCheckoutOpen(true);
        }}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={handleMoveToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderSuccess={handleOrderSuccess}
        setScreen={setScreen}
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
    </div>
  );
}