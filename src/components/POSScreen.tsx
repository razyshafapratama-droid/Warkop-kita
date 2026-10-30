import React, { useState } from 'react';
import { Search, ShoppingCart, Barcode, Filter, AlertCircle, Sparkles } from 'lucide-react';
import { CartItem, Product, StoreSettings } from '../types';
import { ProductCard } from './ProductCard';
import { CartSidebar } from './CartSidebar';
import { formatRupiah } from '../utils/formatters';

interface POSScreenProps {
  products: Product[];
  cart: CartItem[];
  storeSettings: StoreSettings;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToPayment: (discountAmount: number, taxAmount: number) => void;
}

export const POSScreen: React.FC<POSScreenProps> = ({
  products,
  cart,
  storeSettings,
  onAddToCart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToPayment,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Extract distinct categories
  const categories = ['Semua', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));

    const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  // Handle enter key on search input for barcode scanning
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      const match = products.find(
        (p) =>
          p.barcode === search.trim() ||
          p.name.toLowerCase() === search.trim().toLowerCase()
      );
      if (match && match.stock > 0) {
        onAddToCart(match);
        setSearch('');
      }
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start pb-20 lg:pb-6">
      {/* Left Column: Product Selection & Catalog */}
      <div className="flex-1 w-full space-y-4">
        {/* Section Title matching Screenshot 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
              Transaksi Penjualan
            </h2>
            <p className="text-xs text-slate-500">
              Pilih produk dari etalase atau cari menggunakan nama & barcode barang.
            </p>
          </div>

          <span className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs self-start sm:self-auto font-medium">
            {filteredProducts.length} produk ditampilkan
          </span>
        </div>

        {/* Search Input matching Screenshot 2 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Cari nama barang..."
            className="w-full pl-11 pr-24 py-3 bg-white border border-slate-300 rounded-2xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-xs transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Barcode / Enter
            </span>
          </div>
        </div>

        {/* Category Pills Filter matching Screenshot 2 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all duration-150 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Cards Grid matching Screenshot 2 */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <AlertCircle className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">Produk Tidak Ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">
              Tidak ada produk yang cocok dengan pencarian "{search}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const inCart = cart.find((i) => i.product.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQuantity={inCart ? inCart.quantity : 0}
                  onAddToCart={onAddToCart}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Desktop Sticky Cart Sidebar */}
      <div className="hidden lg:block w-96 shrink-0 sticky top-24 h-[calc(100vh-7rem)]">
        <div className="h-full rounded-2xl overflow-hidden border border-slate-200 shadow-md">
          <CartSidebar
            cart={cart}
            storeSettings={storeSettings}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onClearCart={onClearCart}
            onProceedToPayment={onProceedToPayment}
          />
        </div>
      </div>

      {/* Mobile Floating Cart Bar (Sticky at bottom on small screens) */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 p-3 z-30 shadow-2xl">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <button
            onClick={() => setIsMobileCartOpen(true)}
            className="flex-1 flex items-center justify-between bg-slate-900 text-white p-3 rounded-xl shadow-md cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-slate-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="text-left">
                <span className="text-xs block text-slate-400">Keranjang ({totalCartCount})</span>
                <span className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                  {formatRupiah(totalCartPrice)}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold bg-emerald-600 px-3 py-1.5 rounded-lg text-white">
              Buka & Bayar &rarr;
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Cart Drawer Overlay */}
      {isMobileCartOpen && (
        <CartSidebar
          cart={cart}
          storeSettings={storeSettings}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          onClearCart={onClearCart}
          onProceedToPayment={(disc, tax) => {
            setIsMobileCartOpen(false);
            onProceedToPayment(disc, tax);
          }}
          isOpenMobile={true}
          onCloseMobile={() => setIsMobileCartOpen(false)}
        />
      )}
    </div>
  );
};
