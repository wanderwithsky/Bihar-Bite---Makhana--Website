import { useState, DragEvent, ChangeEvent, FormEvent } from 'react';
import { Product } from '../../types';
import { Plus, Edit, Trash2, Search, Filter, Star, Upload, X, RefreshCw, AlertTriangle } from 'lucide-react';

interface AdminProductsTabProps {
  products: Product[];
  onAddProduct: (newProduct: Product) => Promise<void>;
  onEditProduct: (updatedProduct: Product) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=400';

export default function AdminProductsTab({ products, onAddProduct, onEditProduct, onDeleteProduct, showToast }: AdminProductsTabProps) {
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formName, setFormName] = useState('');
  const [formTagline, setFormTagline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<Product['category']>('Roasted');
  const [formBasePrice, setFormBasePrice] = useState(299);
  const [formStock, setFormStock] = useState(50);
  const [formIsFeatured, setFormIsFeatured] = useState(false);
  const [formImage, setFormImage] = useState(DEFAULT_IMAGE);
  const [formError, setFormError] = useState('');
  const [weightPrices, setWeightPrices] = useState<Record<string, number>>({ '100g': 129, '250g': 299, '500g': 549 });
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const lowStockThreshold = 15;

  const resetForm = () => {
    setFormName(''); setFormTagline(''); setFormDescription(''); setFormCategory('Roasted');
    setFormBasePrice(299); setFormStock(50); setFormIsFeatured(false); setFormImage(DEFAULT_IMAGE);
    setWeightPrices({ '100g': 129, '250g': 299, '500g': 549 });
    setUploadedImages([]); setFormError('');
  };

  const openAddModal = () => { resetForm(); setEditingProduct(null); setIsAddModalOpen(true); };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormTagline(product.tagline || '');
    setFormDescription(product.description);
    setFormCategory(product.category);
    setFormBasePrice(product.price);
    setFormStock(product.stock ?? 45);
    setFormIsFeatured(!!product.isBestseller);
    setFormImage(product.image);
    setWeightPrices(product.weightPrices);
    setUploadedImages(product.galleryImages || []);
    setIsAddModalOpen(true);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const processFiles = (files: FileList) => {
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) { clearInterval(interval); setUploadProgress(null); showToast('Images added successfully!', 'success'); return null; }
        return prev + 30;
      });
    }, 150);
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => { if (typeof reader.result === 'string') setUploadedImages(prev => [...prev, reader.result as string]); };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) processFiles(e.target.files);
  };

  const handlePrimaryImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { if (typeof reader.result === 'string') setFormImage(reader.result); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeUploadedImage = (index: number) => setUploadedImages(prev => prev.filter((_, i) => i !== index));

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formName || !formDescription || formBasePrice <= 0) {
      const missing: string[] = [];
      if (!formName) missing.push('Flavor Name');
      if (!formDescription) missing.push('Description');
      if (formBasePrice <= 0) missing.push('Base Price (must be greater than 0)');
      const msg = `Missing/invalid: ${missing.join(', ')}.`;
      setFormError(msg); showToast(msg, 'error');
      return;
    }
    setFormError('');

    const payload: Product = {
      id: editingProduct ? editingProduct.id : `${formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now().toString(36)}`,
      name: formName,
      tagline: formTagline,
      description: formDescription,
      price: formBasePrice,
      category: formCategory,
      flavors: [formName.split(' ')[0]],
      image: formImage,
      galleryImages: uploadedImages.length > 0 ? uploadedImages : [formImage],
      weights: Object.keys(weightPrices),
      weightPrices,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewCount: editingProduct ? editingProduct.reviewCount : 1,
      reviews: editingProduct ? editingProduct.reviews : [{ id: '1', userName: 'Admin Team', rating: 5, date: new Date().toISOString().slice(0, 10), comment: 'Quality verified at sourcing.' }],
      isBestseller: formIsFeatured,
      isNew: !editingProduct,
      stock: formStock
    };

    setIsSaving(true);
    try {
      if (editingProduct) await onEditProduct(payload); else await onAddProduct(payload);
      setIsAddModalOpen(false); resetForm();
    } catch (err) {
      // Parent already showed the real error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently withdraw "${name}" from listings?`)) {
      try { await onDeleteProduct(id); } catch (err) { /* toast already shown by parent */ }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.description.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCategory = productCategory === 'All' || p.category === productCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-xs text-on-surface-variant/70">Replenish, edit, and manage the Makhana catalog.</p>
        <button onClick={openAddModal} className="bg-[#7C8464] hover:bg-[#6A7155] text-white px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer self-start">
          <Plus className="w-4 h-4" /> Launch New Flavor
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 bg-[#FAF8F4] p-4 rounded-2xl border border-[#E5DFD1]/60">
        <div className="relative flex-grow">
          <input type="text" placeholder="Search catalog products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full bg-white border border-outline-variant/30 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-primary text-on-surface" />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-on-surface-variant/70" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-on-surface-variant/70 hidden sm:inline" />
          <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="bg-white border border-outline-variant/30 text-xs px-4 py-2.5 rounded-xl text-on-surface focus:outline-none focus:border-primary font-bold">
            <option value="All">All Categories</option>
            <option value="Plain">Plain</option>
            <option value="Roasted">Roasted</option>
            <option value="Flavoured">Flavoured</option>
            <option value="Premium">Premium</option>
            <option value="Gift Packs">Gift Packs</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-outline-variant/30 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F4] border-b border-[#E5DFD1] text-[10px] tracking-widest uppercase font-bold text-[#4A4A3A]">
                <th className="py-4 px-6">Product details</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4 font-mono">Price</th>
                <th className="py-4 px-4 font-mono">Stock reserves</th>
                <th className="py-4 px-4">Bestseller</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs text-on-surface-variant">
              {filteredProducts.map(p => {
                const stock = p.stock !== undefined ? p.stock : 45;
                return (
                  <tr key={p.id} className="hover:bg-[#FAF8F4]/35 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img src={p.image} alt={p.name} referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-xl border border-outline-variant/20 shadow-sm" />
                        <div>
                          <h4 className="font-serif text-sm font-bold text-primary">{p.name}</h4>
                          <p className="text-[10px] text-on-surface-variant/70 mt-0.5 max-w-xs truncate">{p.tagline || p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4"><span className="px-2.5 py-1 bg-[#E5DFD1]/50 text-primary rounded-full text-[10px] font-bold">{p.category}</span></td>
                    <td className="py-4 px-4 font-mono font-bold text-primary">₹{p.price}</td>
                    <td className="py-4 px-4 font-mono"><span className={`font-bold ${stock <= lowStockThreshold ? 'text-red-600' : 'text-on-surface-variant'}`}>{stock} bags</span></td>
                    <td className="py-4 px-4"><span className="text-amber-500 flex items-center gap-1 font-bold">{p.isBestseller ? <Star className="w-4 h-4 fill-amber-500" /> : <span className="text-gray-300">-</span>}</span></td>
                    <td className="py-4 px-6 text-right space-x-1.5 whitespace-nowrap">
                      <button onClick={() => openEditModal(p)} className="p-1.5 hover:bg-primary/10 rounded-lg text-primary transition-colors cursor-pointer" title="Edit Listing"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="p-1.5 hover:bg-[#A85344]/10 rounded-lg text-[#A85344] transition-colors cursor-pointer" title="Delete Listing"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-on-surface-variant/70">No makhana flavors match current query parameters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div id="product-form-modal-body" className="bg-[#FAF8F4] border-2 border-primary/20 rounded-[36px] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 md:p-8 space-y-6 relative animate-scale-up">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute right-6 top-6 p-2 bg-white/80 hover:bg-[#A85344]/15 rounded-full text-on-surface-variant hover:text-[#A85344] transition-all cursor-pointer"><X className="w-4 h-4" /></button>

            <div>
              <span className="text-secondary font-serif italic text-xs uppercase tracking-widest block mb-1">Makhana Catalog Editor</span>
              <h3 className="font-serif text-2xl font-bold text-primary">{editingProduct ? `Modify Flavor: ${editingProduct.name}` : 'Launch Curated New Flavor'}</h3>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl p-3.5 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" /><span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Flavor Name</label>
                  <input type="text" required placeholder="e.g., Cheddar Barbeque" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full bg-white border border-[#E5DFD1] rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-primary text-on-surface" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Tagline</label>
                  <input type="text" placeholder="e.g., Crisped in pure Desi Cow Ghee" value={formTagline} onChange={(e) => setFormTagline(e.target.value)} className="w-full bg-white border border-[#E5DFD1] rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-primary text-on-surface" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Category</label>
                  <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as any)} className="w-full bg-white border border-[#E5DFD1] rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-primary text-on-surface font-bold">
                    <option value="Plain">Plain (Natural)</option>
                    <option value="Roasted">Slow-Roasted</option>
                    <option value="Flavoured">Heritage Flavoured</option>
                    <option value="Premium">Premium Selection</option>
                    <option value="Gift Packs">Curated Gift Packs</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Base Display Price (₹)</label>
                  <input type="number" required value={formBasePrice} onChange={(e) => setFormBasePrice(Number(e.target.value))} className="w-full bg-white border border-[#E5DFD1] rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-primary text-on-surface font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Initial Inventory Stock (Bags)</label>
                  <input type="number" required value={formStock} onChange={(e) => setFormStock(Number(e.target.value))} className="w-full bg-white border border-[#E5DFD1] rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-primary text-on-surface font-mono" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Primary Product Image</label>
                  <div className="flex items-center gap-3">
                    <img src={formImage} alt="Primary preview" referrerPolicy="no-referrer" className="w-14 h-14 object-cover rounded-xl border border-[#E5DFD1] shrink-0" />
                    <label className="flex-1 cursor-pointer bg-white border border-dashed border-[#E5DFD1] rounded-xl py-2.5 px-4 text-center hover:bg-[#FAF8F4]/50 transition-colors">
                      <span className="text-xs font-bold text-[#4A4A3A] flex items-center justify-center gap-1.5"><Upload className="w-3.5 h-3.5" /> Choose from Gallery</span>
                      <input type="file" accept="image/*" onChange={handlePrimaryImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E5DFD1] flex flex-wrap gap-6 items-center">
                <label className="flex items-center gap-2 text-xs font-bold text-[#4A4A3A] cursor-pointer">
                  <input type="checkbox" checked={formIsFeatured} onChange={(e) => setFormIsFeatured(e.target.checked)} className="rounded border-[#E5DFD1] text-primary focus:ring-primary/20" />
                  Mark as Featured Bestseller
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-[#4A4A3A]">Description Narrative</label>
                <textarea required rows={3} placeholder="Details of popping, recipe origin, ghee usage, minerals etc..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} className="w-full bg-white border border-[#E5DFD1] rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-primary text-on-surface leading-relaxed" />
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#E5DFD1] space-y-4">
                <h4 className="font-serif text-sm font-bold text-primary">Weights & Custom Pricing Tiers</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['100g', '250g', '500g'].map(w => (
                    <div key={w} className="space-y-1.5 bg-[#FAF8F4] p-3 rounded-xl border border-[#E5DFD1]">
                      <span className="font-bold text-[10px] text-primary">{w} tier price</span>
                      <input type="number" value={weightPrices[w] || 0} onChange={(e) => setWeightPrices(prev => ({ ...prev, [w]: Number(e.target.value) }))} className="w-full bg-white border border-[#E5DFD1] rounded-lg py-1 px-2.5 text-xs focus:outline-none focus:border-primary font-mono text-on-surface" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[#4A4A3A] block">Drag-and-Drop Gallery Image Uploads</span>
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors relative cursor-pointer ${dragActive ? 'border-primary bg-primary/5' : 'border-[#E5DFD1] bg-white hover:bg-[#FAF8F4]/50'}`} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}>
                  <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  <div className="space-y-2 flex flex-col items-center">
                    <Upload className="w-8 h-8 text-[#7C8464] stroke-[1.5]" />
                    <div>
                      <p className="text-xs font-bold text-[#4A4A3A]">Drag & drop multiple product images or click to select</p>
                      <p className="text-[10px] text-on-surface-variant/70 mt-1">Supports PNG, JPEG, WEBP up to 5MB each</p>
                    </div>
                  </div>
                  {uploadProgress !== null && (
                    <div className="absolute inset-0 bg-[#FAF8F4]/90 rounded-2xl flex flex-col items-center justify-center p-6 animate-fade-in z-20">
                      <RefreshCw className="w-6 h-6 text-secondary animate-spin mb-2" />
                      <p className="text-xs font-bold text-primary">Uploading image attachments... {uploadProgress}%</p>
                      <div className="w-48 bg-[#E5DFD1] h-1.5 rounded-full overflow-hidden mt-2"><div className="bg-secondary h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} /></div>
                    </div>
                  )}
                </div>
                {uploadedImages.length > 0 && (
                  <div className="pt-3">
                    <span className="text-[9px] uppercase font-bold text-[#4A4A3A]/70 tracking-wider block mb-2">Live Previews ({uploadedImages.length})</span>
                    <div className="flex flex-wrap gap-2.5">
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-outline-variant/30 group">
                          <img src={img} alt={`Upload Preview ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeUploadedImage(idx)} className="absolute top-1 right-1 bg-black/60 hover:bg-[#A85344] p-0.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer"><X className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5DFD1]/50">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 border border-[#E5DFD1] rounded-xl text-xs font-bold text-on-surface-variant hover:bg-[#FAF8F4] transition-colors cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2.5 bg-[#7C8464] hover:bg-[#6A7155] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                  {isSaving ? 'Saving...' : (editingProduct ? 'Save Flavor Specs' : 'Launch Roasted Flavor')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}