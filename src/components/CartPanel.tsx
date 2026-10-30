import React from 'react';
import { ShoppingBag, Trash2, Minus, Plus, X, Banknote, QrCode, Wallet, Printer, Save, CreditCard } from 'lucide-react';
import { CartItem, PaymentMethod, StoreSettings } from '../types';
import { formatRupiah } from '../utils/formatters';

interface CartPanelProps {
  cart: CartItem[];
  storeSettings: StoreSettings;
  paymentMethod: PaymentMethod;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPay: () => void;
  onPrintReceipt: () => void;
  onSaveTransaction: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  storeSettings,
  paymentMethod,
  onSelectPaymentMethod,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPay,
  onPrintReceipt,
  onSaveTransaction,
}) => {
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Pajak (10% default as in screenshot)
  const taxRate = storeSettings.enableTax ? (storeSettings.taxRatePercent || 10) : 0;
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="w-full lg:w-[380px] xl:w-[410px] bg-white rounded-3xl border border-[#E5DDD5] shadow-sm flex flex-col justify-between shrink-0 p-5 select-none">
      {/* Cart Header matching reference */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE2]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#3D2417]" />
            <h3 className="font-extrabold text-base sm:text-lg text-[#1E120D]">
              Keranjang
            </h3>
            {totalItemsCount > 0 && (
              <span className="w-6 h-6 rounded-full bg-[#3D2417] text-[#E2C39B] font-bold text-xs flex items-center justify-center">
                {totalItemsCount}
              </span>
            )}
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7A6B] hover:text-[#C84B31] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Semua</span>
            </button>
          )}
        </div>

        {/* Cart Items List matching reference screenshot */}
        <div className="py-4 space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {cart.length === 0 ? (
            <div className="py-12 text-center text-[#9E8775]">
              <div className="w-14 h-14 rounded-2xl bg-[#F7F4EE] flex items-center justify-center mx-auto mb-3 border border-[#E5DDD5]">
                <ShoppingBag className="w-6 h-6 text-[#BAA688]" />
              </div>
              <p className="font-bold text-sm text-[#3D2417]">Keranjang Masih Kosong</p>
              <p className="text-xs text-[#8C7A6B] mt-1 max-w-[200px] mx-auto">
                Pilih menu kopi atau camilan untuk mulai mencatat pesanan.
              </p>
            </div>
          ) : (
            cart.map((item) => {
              const itemTotal = item.product.price * item.quantity;
              const tableLabel = item.table ? `(${item.table})` : item.orderType === 'take_away' ? '(Take Away)' : '';

              return (
                <div key={item.product.id} className="flex gap-3 items-center group">
                  {/* Thumbnail Image */}
                  <img
                    src={item.product.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80'}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#EBE3DA]"
                  />

                  {/* Info & Quantity Controller */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h5 className="font-extrabold text-xs sm:text-sm text-[#1E120D] truncate">
                        {item.product.name} <span className="font-semibold text-xs text-[#7A685D]">{tableLabel}</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-[#9E8775] hover:text-[#C84B31] p-0.5 rounded cursor-pointer transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs font-semibold text-[#8C7A6B] mt-0.5">
                      {formatRupiah(item.product.price)}
                    </p>

                    {/* Quantity controls and item subtotal */}
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-2 border border-[#E5DDD5] rounded-lg px-1.5 py-0.5 bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#5A3824] hover:bg-[#EFE9DF] rounded cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center font-bold text-xs text-[#1E120D]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#5A3824] hover:bg-[#EFE9DF] rounded cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-extrabold text-xs sm:text-sm text-[#1E120D] font-['Plus_Jakarta_Sans']">
                        {formatRupiah(itemTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cart Summary, Payment Method, and Action Buttons */}
      <div className="pt-4 border-t border-[#F0EAE2] space-y-4">
        {/* Calculations: Subtotal & Tax */}
        <div className="space-y-1.5 text-xs sm:text-sm font-medium text-[#7A685D]">
          <div className="flex justify-between items-center">
            <span>Subtotal</span>
            <span className="font-bold text-[#1E120D]">{formatRupiah(subtotal)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span>Pajak ({taxRate}%)</span>
            <span className="font-bold text-[#1E120D]">{formatRupiah(taxAmount)}</span>
          </div>

          {/* Dotted line separator matching reference */}
          <div className="border-t border-dashed border-[#D9CEBA] pt-2 mt-2">
            <div className="flex justify-between items-baseline">
              <span className="font-extrabold text-sm sm:text-base text-[#1E120D]">
                Total
              </span>
              <span className="font-black text-xl sm:text-2xl text-[#1E120D] font-['Plus_Jakarta_Sans']">
                {formatRupiah(grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method Selector matching reference image */}
        <div>
          <label className="block text-xs font-bold text-[#1E120D] mb-2">
            Metode Pembayaran
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => onSelectPaymentMethod('TUNAI')}
              className={`py-2.5 px-2 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                paymentMethod === 'TUNAI'
                  ? 'bg-[#3D2417] text-white border-[#3D2417] shadow-xs'
                  : 'bg-[#FDFBF7] hover:bg-[#F5EFEB] text-[#1E120D] border-[#E5DDD5]'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Tunai</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectPaymentMethod('QRIS')}
              className={`py-2.5 px-2 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                paymentMethod === 'QRIS'
                  ? 'bg-[#3D2417] text-white border-[#3D2417] shadow-xs'
                  : 'bg-[#FDFBF7] hover:bg-[#F5EFEB] text-[#1E120D] border-[#E5DDD5]'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>QRIS</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectPaymentMethod('E_WALLET')}
              className={`py-2.5 px-2 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                paymentMethod === 'E_WALLET'
                  ? 'bg-[#3D2417] text-white border-[#3D2417] shadow-xs'
                  : 'bg-[#FDFBF7] hover:bg-[#F5EFEB] text-[#1E120D] border-[#E5DDD5]'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>E-Wallet</span>
            </button>
          </div>
        </div>

        {/* Primary Pay Button matching reference */}
        <button
          type="button"
          disabled={cart.length === 0}
          onClick={onPay}
          className={`w-full py-3.5 px-4 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
            cart.length === 0
              ? 'bg-[#D9CEBA] text-[#7A685D] cursor-not-allowed shadow-none'
              : 'bg-[#3D2417] hover:bg-[#2C1A10] text-white shadow-[#3D2417]/20 active:scale-[0.99]'
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#E2C39B]" />
          <span>Bayar ({formatRupiah(grandTotal)})</span>
        </button>

        {/* Secondary Buttons: Cetak Struk & Simpan Transaksi */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={onPrintReceipt}
            className="py-2.5 px-3 rounded-2xl bg-white hover:bg-[#F5EFEB] border border-[#E5DDD5] text-xs font-bold text-[#1E120D] flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Printer className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span>Cetak Struk</span>
          </button>

          <button
            type="button"
            disabled={cart.length === 0}
            onClick={onSaveTransaction}
            className="py-2.5 px-3 rounded-2xl bg-white hover:bg-[#F5EFEB] border border-[#E5DDD5] text-xs font-bold text-[#1E120D] flex items-center justify-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3.5 h-3.5 text-[#6F4E37]" />
            <span>Simpan Transaksi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
