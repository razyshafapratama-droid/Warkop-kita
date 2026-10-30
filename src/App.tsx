/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Transaction, UserAccount, StoreSettings, PaymentMethod, OrderType, TableNumber } from './types';
import { StoreService } from './services/storeService';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { OrderModeBar } from './components/OrderModeBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { CartPanel } from './components/CartPanel';
import { BottomStatusBar } from './components/BottomStatusBar';
import { ProductManagement } from './components/ProductManagement';
import { ReportsScreen } from './components/ReportsScreen';
import { TransactionHistoryView } from './components/TransactionHistoryView';
import { PaymentModal } from './components/PaymentModal';
import { ReceiptModal } from './components/ReceiptModal';
import { RoleLoginModal } from './components/RoleLoginModal';
import { SettingsModal } from './components/SettingsModal';
import { generateInvoiceNumber } from './utils/formatters';

export default function App() {
  // Main Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: 'Warkop Kita',
    tagline: 'Ngopi, Santai, Produktif',
    address: 'Jl. Kopi Kenangan No. 12, Jakarta',
    phone: '0812-9876-5432',
    receiptFooterMessage: 'Terima kasih telah berkunjung ke Warkop Kita!\nNikmati hari santai dan produktif Anda bersama secangkir kopi terbaik.',
    enableTax: true,
    taxRatePercent: 10,
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(StoreService.getCurrentUser());
  const [allUsers] = useState<UserAccount[]>(StoreService.getAllUsers());

  // View States
  const [activeTab, setActiveTab] = useState<'kasir' | 'riwayat' | 'produk' | 'laporan' | 'pengaturan'>('kasir');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Order & Table Selection States matching reference image
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [selectedTable, setSelectedTable] = useState<TableNumber>('T1');

  // Cart State (Initialized with items matching the reference screenshot)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('warkop_saved_cart_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Selected Payment Method in right panel
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TUNAI');

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [activeReceiptTransaction, setActiveReceiptTransaction] = useState<Transaction | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Load Data
  const loadData = useCallback(async () => {
    try {
      const [prods, txs, settings] = await Promise.all([
        StoreService.loadProducts(),
        StoreService.loadTransactions(),
        StoreService.loadSettings(),
      ]);
      setProducts(prods);
      setTransactions(txs);
      setStoreSettings(settings);

      // If cart is completely empty on initial load, pre-populate with the 4 items from the reference design
      setCart((prev) => {
        if (prev.length > 0) return prev;
        const kopiSusu = prods.find((p) => p.name === 'Kopi Susu');
        const cappuccino = prods.find((p) => p.name === 'Cappuccino');
        const matchaLatte = prods.find((p) => p.name === 'Matcha Latte');
        const rotiBakar = prods.find((p) => p.name === 'Roti Bakar');

        const initialCart: CartItem[] = [];
        if (kopiSusu) initialCart.push({ product: kopiSusu, quantity: 1, table: 'T1', orderType: 'dine_in' });
        if (cappuccino) initialCart.push({ product: cappuccino, quantity: 1, table: 'T1', orderType: 'dine_in' });
        if (matchaLatte) initialCart.push({ product: matchaLatte, quantity: 1, table: 'T1', orderType: 'dine_in' });
        if (rotiBakar) initialCart.push({ product: rotiBakar, quantity: 1, table: 'T1', orderType: 'dine_in' });

        return initialCart;
      });
    } catch (e) {
      console.error('Error loading data:', e);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = StoreService.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('warkop_saved_cart_v2', JSON.stringify(cart));
  }, [cart]);

  // Cart Operations
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast(`Stok ${product.name} telah habis!`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.product.id === product.id);
      if (existing) {
        return prevCart.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity: 1,
            table: orderType === 'dine_in' ? selectedTable : null,
            orderType,
          },
        ];
      }
    });
    showToast(`${product.name} ditambahkan ke keranjang`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Keranjang telah dikosongkan');
  };

  // Calculations
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const taxRate = storeSettings.enableTax ? (storeSettings.taxRatePercent || 10) : 0;
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const grandTotal = subtotal + taxAmount;

  // Complete Payment and Record Transaction
  const handleCompletePayment = async (
    method: PaymentMethod,
    amountPaid: number,
    change: number
  ) => {
    if (cart.length === 0) return;

    const invoiceNumber = generateInvoiceNumber(transactions.length + 1).replace('TRK', 'WK');
    const transactionPayload: Omit<Transaction, 'id'> = {
      invoiceNumber,
      timestamp: new Date().toISOString(),
      orderType,
      tableNumber: orderType === 'dine_in' ? selectedTable : null,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        cost: item.product.cost || Math.round(item.product.price * 0.5),
        quantity: item.quantity,
        unit: item.product.unit,
        subtotal: item.product.price * item.quantity,
        table: item.table,
        orderType: item.orderType,
        image: item.product.image,
      })),
      subtotal,
      discount: 0,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod: method,
      amountPaid,
      change,
      cashierName: currentUser.name,
      cashierRole: currentUser.role,
    };

    try {
      const savedTrx = await StoreService.recordTransaction(transactionPayload);
      setIsPaymentModalOpen(false);
      setCart([]);
      setActiveReceiptTransaction(savedTrx);
      setIsReceiptModalOpen(true);
      showToast(`Pesanan ${savedTrx.invoiceNumber} berhasil dibayar!`);
    } catch (e) {
      console.error('Failed to complete transaction', e);
      showToast('Gagal memproses transaksi.');
    }
  };

  // Instant Save Transaction without modal
  const handleSaveTransactionDirect = async () => {
    if (cart.length === 0) return;
    const invoiceNumber = generateInvoiceNumber(transactions.length + 1).replace('TRK', 'WK');
    const transactionPayload: Omit<Transaction, 'id'> = {
      invoiceNumber,
      timestamp: new Date().toISOString(),
      orderType,
      tableNumber: orderType === 'dine_in' ? selectedTable : null,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        cost: item.product.cost || Math.round(item.product.price * 0.5),
        quantity: item.quantity,
        unit: item.product.unit,
        subtotal: item.product.price * item.quantity,
        table: item.table,
        orderType: item.orderType,
        image: item.product.image,
      })),
      subtotal,
      discount: 0,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod,
      amountPaid: grandTotal,
      change: 0,
      cashierName: currentUser.name,
      cashierRole: currentUser.role,
    };

    const saved = await StoreService.recordTransaction(transactionPayload);
    setCart([]);
    showToast(`Transaksi ${saved.invoiceNumber} tersimpan di riwayat!`);
  };

  // Open direct receipt for active cart
  const handlePrintCurrentCartReceipt = () => {
    if (cart.length === 0) return;
    const tempTrx: Transaction = {
      id: `temp-${Date.now()}`,
      invoiceNumber: `WK-DRAFT-${String(transactions.length + 1).padStart(3, '0')}`,
      timestamp: new Date().toISOString(),
      orderType,
      tableNumber: orderType === 'dine_in' ? selectedTable : null,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        cost: item.product.cost || Math.round(item.product.price * 0.5),
        quantity: item.quantity,
        unit: item.product.unit,
        subtotal: item.product.price * item.quantity,
        table: item.table,
        orderType: item.orderType,
      })),
      subtotal,
      discount: 0,
      tax: taxAmount,
      total: grandTotal,
      paymentMethod,
      amountPaid: grandTotal,
      change: 0,
      cashierName: currentUser.name,
      cashierRole: currentUser.role,
    };
    setActiveReceiptTransaction(tempTrx);
    setIsReceiptModalOpen(true);
  };

  // Product CRUD
  const handleSaveProduct = async (prodData: Partial<Product> & { name: string; price: number }) => {
    await StoreService.saveProduct(prodData);
    showToast('Menu warkop berhasil disimpan!');
  };

  const handleDeleteProduct = async (id: string) => {
    await StoreService.deleteProduct(id);
    showToast('Menu berhasil dihapus!');
  };

  const handleRestockProduct = async (id: string, additionalQty: number) => {
    await StoreService.restockProduct(id, additionalQty);
    showToast(`Stok berhasil ditambahkan (+${additionalQty})!`);
  };

  // Switch User
  const handleSelectUser = (user: UserAccount) => {
    setCurrentUser(user);
    StoreService.setCurrentUser(user);
    showToast(`Login sebagai ${user.name}`);
  };

  // Settings
  const handleSaveSettings = async (newSettings: StoreSettings) => {
    await StoreService.saveSettings(newSettings);
    setStoreSettings(newSettings);
    showToast('Pengaturan warkop diperbarui!');
  };

  // Reset Demo
  const handleResetDemo = async () => {
    if (window.confirm('Kembalikan menu dan transaksi ke data awal Warkop Kita?')) {
      await StoreService.resetDemo();
      setCart([]);
      localStorage.removeItem('warkop_saved_cart_v2');
      await loadData();
      showToast('Data demo Warkop Kita berhasil di-reset!');
    }
  };

  // Filter products for catalog
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.barcode && p.barcode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen flex bg-[#F7F4EE] text-[#1E120D] font-['Plus_Jakarta_Sans'] selection:bg-[#4A2C1D] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#1E120D] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-2xl border border-[#3D2417] animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4A373] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Left Sidebar matching reference design */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'pengaturan') {
            setIsSettingsModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onLogout={() => setIsRoleModalOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 p-5 sm:p-7 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <TopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={currentUser}
          onOpenUserModal={() => setIsRoleModalOpen(true)}
          title={
            activeTab === 'kasir'
              ? 'Kasir'
              : activeTab === 'riwayat'
              ? 'Riwayat Transaksi'
              : activeTab === 'produk'
              ? 'Katalog Produk'
              : 'Laporan Penjualan'
          }
          subtitle={
            activeTab === 'kasir'
              ? 'Pilih produk dan lakukan transaksi'
              : activeTab === 'riwayat'
              ? 'Daftar transaksi pesanan warkop'
              : activeTab === 'produk'
              ? 'Kelola daftar menu dan stok'
              : 'Ringkasan omzet dan menu terlaris'
          }
        />

        {/* Tab 1: Kasir Screen matching reference design 1:1 */}
        {activeTab === 'kasir' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left Main Area: Order Mode, Category Filter, Product Grid, Bottom Status Bar */}
            <div className="flex-1 w-full min-w-0 flex flex-col justify-between">
              <div>
                {/* 1. Order Mode Bar: Tables vs Take Away + Pilih Meja */}
                <OrderModeBar
                  orderType={orderType}
                  selectedTable={selectedTable}
                  onSelectOrderType={setOrderType}
                  onSelectTable={setSelectedTable}
                />

                {/* 2. Category Filter Cards */}
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />

                {/* 3. Product Catalog Header */}
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="font-extrabold text-base sm:text-lg text-[#1E120D]">
                    Menu Produk
                  </h3>
                  <span className="text-xs font-bold text-[#8C7A6B]">
                    {filteredProducts.length} Produk
                  </span>
                </div>

                {/* 4. Product Catalog Grid (4 Columns as in mockup) */}
                {filteredProducts.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-[#E5DDD5] p-12 text-center text-[#7A685D]">
                    <p className="font-extrabold text-[#1E120D] text-base">Menu Tidak Ditemukan</p>
                    <p className="text-xs text-[#8C7A6B] mt-1">Coba gunakan kata kunci pencarian lain atau pilih kategori Semua.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
                    {filteredProducts.map((product) => {
                      const inCart = cart.find((i) => i.product.id === product.id);
                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          cartQuantity={inCart ? inCart.quantity : 0}
                          onAddToCart={handleAddToCart}
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 5. Bottom Status Bar matching reference design */}
              <BottomStatusBar
                orderType={orderType}
                selectedTable={selectedTable}
                totalItemsCount={totalItemsCount}
                grandTotal={grandTotal}
              />
            </div>

            {/* Right Panel: Cart Panel matching reference design */}
            <CartPanel
              cart={cart}
              storeSettings={storeSettings}
              paymentMethod={paymentMethod}
              onSelectPaymentMethod={setPaymentMethod}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onPay={() => setIsPaymentModalOpen(true)}
              onPrintReceipt={handlePrintCurrentCartReceipt}
              onSaveTransaction={handleSaveTransactionDirect}
            />
          </div>
        )}

        {/* Tab 2: Riwayat Transaksi */}
        {activeTab === 'riwayat' && (
          <TransactionHistoryView
            transactions={transactions}
            onSelectTransaction={(trx) => {
              setActiveReceiptTransaction(trx);
              setIsReceiptModalOpen(true);
            }}
          />
        )}

        {/* Tab 3: Manajemen Menu & Stok */}
        {activeTab === 'produk' && (
          <ProductManagement
            products={products}
            userRole={currentUser.role}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onRestockProduct={handleRestockProduct}
            onRequestAdminAccess={() => setIsRoleModalOpen(true)}
          />
        )}

        {/* Tab 4: Laporan Omzet & Penjualan */}
        {activeTab === 'laporan' && (
          <ReportsScreen
            transactions={transactions}
            products={products}
            userRole={currentUser.role}
            onViewTransactionDetail={(trx) => {
              setActiveReceiptTransaction(trx);
              setIsReceiptModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Payment Processing Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={grandTotal}
        orderType={orderType}
        tableNumber={selectedTable}
        defaultMethod={paymentMethod}
        onCompletePayment={handleCompletePayment}
      />

      {/* Thermal Receipt Print Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        transaction={activeReceiptTransaction}
        storeSettings={storeSettings}
        onClose={() => setIsReceiptModalOpen(false)}
        onNewTransaction={() => {
          setIsReceiptModalOpen(false);
          setActiveTab('kasir');
        }}
      />

      {/* Role / User Switch Modal */}
      <RoleLoginModal
        isOpen={isRoleModalOpen}
        currentUser={currentUser}
        allUsers={allUsers}
        onClose={() => setIsRoleModalOpen(false)}
        onSelectUser={handleSelectUser}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        settings={storeSettings}
        onClose={() => setIsSettingsModalOpen(false)}
        onSaveSettings={handleSaveSettings}
        onResetDemo={handleResetDemo}
      />
    </div>
  );
}
