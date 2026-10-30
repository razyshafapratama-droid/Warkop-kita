import React, { useState, useEffect } from 'react';
import { X, Banknote, QrCode, Wallet, CheckCircle2, AlertCircle, Printer, CreditCard } from 'lucide-react';
import { OrderType, PaymentMethod, TableNumber } from '../types';
import { formatRupiah } from '../utils/formatters';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  orderType: OrderType;
  tableNumber: TableNumber;
  defaultMethod?: PaymentMethod;
  onCompletePayment: (paymentMethod: PaymentMethod, amountPaid: number, change: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  orderType,
  tableNumber,
  defaultMethod = 'TUNAI',
  onCompletePayment,
}) => {
  const [method, setMethod] = useState<PaymentMethod>(defaultMethod);
  const [cashGiven, setCashGiven] = useState<number>(totalAmount);
  const [customCashInput, setCustomCashInput] = useState<string>(String(totalAmount));
  const [selectedEwallet, setSelectedEwallet] = useState<string>('GoPay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setMethod(defaultMethod);
      setCashGiven(totalAmount);
      setCustomCashInput(String(totalAmount));
      setIsProcessing(false);
    }
  }, [isOpen, totalAmount, defaultMethod]);

  if (!isOpen) return null;

  const currentCash = method === 'TUNAI' ? cashGiven : totalAmount;
  const change = Math.max(0, currentCash - totalAmount);
  const shortfall = Math.max(0, totalAmount - currentCash);
  const isPayable = method !== 'TUNAI' || currentCash >= totalAmount;

  // Preset quick cash buttons
  const quickCashOptions = [
    { label: 'Uang Pas', amount: totalAmount },
    { label: '10.000', amount: 10000 },
    { label: '20.000', amount: 20000 },
    { label: '50.000', amount: 50000 },
    { label: '100.000', amount: 100000 },
  ];

  const handleQuickCash = (amt: number) => {
    setCashGiven(amt);
    setCustomCashInput(String(amt));
  };

  const handleCustomCashChange = (val: string) => {
    setCustomCashInput(val);
    const num = parseInt(val.replace(/\D/g, ''), 10) || 0;
    setCashGiven(num);
  };

  const handleSubmit = () => {
    if (!isPayable) return;
    setIsProcessing(true);
    setTimeout(() => {
      onCompletePayment(method, currentCash, change);
      setIsProcessing(false);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E120D]/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5DDD5]">
        {/* Header matching coffee theme */}
        <div className="bg-[#1E120D] text-white p-5 flex items-center justify-between border-b border-[#2C1A12]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-white">Pembayaran Pesanan</h3>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#3D2417] text-[#D4A373] border border-[#523322]">
                {orderType === 'dine_in' ? `Meja ${tableNumber || 'T1'}` : 'Take Away'}
              </span>
            </div>
            <p className="text-xs text-[#C5B3A1] mt-0.5">Warkop Kita &bull; Kasir POS</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2C1A12] hover:bg-[#3D2417] flex items-center justify-center text-[#C5B3A1] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 bg-[#FAF7F2]">
          {/* Total Tagihan Box */}
          <div className="bg-white border border-[#E5DDD5] rounded-2xl p-4 text-center shadow-xs">
            <span className="text-xs font-bold text-[#7A685D] uppercase tracking-wider">
              Total Pembayaran
            </span>
            <div className="text-3xl sm:text-4xl font-black text-[#1E120D] mt-1 font-['Plus_Jakarta_Sans']">
              {formatRupiah(totalAmount)}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-extrabold text-[#1E120D] mb-2">
              Pilih Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('TUNAI')}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                  method === 'TUNAI'
                    ? 'bg-[#3D2417] text-white border-[#3D2417] shadow-xs'
                    : 'bg-white hover:bg-[#F5EFEB] text-[#1E120D] border-[#E5DDD5]'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#E2C39B]" />
                <span>Tunai</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('QRIS')}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                  method === 'QRIS'
                    ? 'bg-[#3D2417] text-white border-[#3D2417] shadow-xs'
                    : 'bg-white hover:bg-[#F5EFEB] text-[#1E120D] border-[#E5DDD5]'
                }`}
              >
                <QrCode className="w-5 h-5 text-[#E2C39B]" />
                <span>QRIS</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('E_WALLET')}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center gap-1 text-xs font-bold border transition-all cursor-pointer ${
                  method === 'E_WALLET'
                    ? 'bg-[#3D2417] text-white border-[#3D2417] shadow-xs'
                    : 'bg-white hover:bg-[#F5EFEB] text-[#1E120D] border-[#E5DDD5]'
                }`}
              >
                <Wallet className="w-5 h-5 text-[#E2C39B]" />
                <span>E-Wallet</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Tunai Content */}
          {method === 'TUNAI' && (
            <div className="space-y-4 bg-white p-4 rounded-2xl border border-[#E5DDD5]">
              {/* Quick Cash Buttons */}
              <div>
                <span className="block text-xs font-semibold text-[#7A685D] mb-1.5">
                  Nominal Cepat:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {quickCashOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickCash(opt.amount)}
                      className={`py-2 px-2 rounded-xl text-xs font-extrabold border transition-colors cursor-pointer ${
                        cashGiven === opt.amount
                          ? 'bg-[#3D2417] text-white border-[#3D2417]'
                          : 'bg-[#F7F4EE] hover:bg-[#EFE9DF] text-[#1E120D] border-[#E5DDD5]'
                      }`}
                    >
                      {opt.label === 'Uang Pas' ? 'Uang Pas' : formatRupiah(opt.amount)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Cash Input */}
              <div>
                <label className="block text-xs font-bold text-[#1E120D] mb-1">
                  Uang Diterima dari Pelanggan (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A685D] font-black text-sm">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={customCashInput ? parseInt(customCashInput, 10).toLocaleString('id-ID') : ''}
                    onChange={(e) => handleCustomCashChange(e.target.value)}
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-[#E5DDD5] text-[#1E120D] font-black text-lg focus:outline-none focus:border-[#4A2C1D] focus:ring-2 focus:ring-[#4A2C1D]/20 bg-[#FAF7F2]"
                  />
                </div>
              </div>

              {/* Kembalian / Kurang Status Display */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  shortfall > 0
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  {shortfall > 0 ? (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider block">
                      {shortfall > 0 ? 'Uang Masih Kurang' : 'Kembalian Pelanggan'}
                    </span>
                    <span className="text-xl font-black font-['Plus_Jakarta_Sans']">
                      {shortfall > 0 ? formatRupiah(shortfall) : formatRupiah(change)}
                    </span>
                  </div>
                </div>

                {change > 0 && (
                  <span className="text-xs font-bold bg-emerald-600 text-white px-2.5 py-1 rounded-full">
                    Kembalian Pas
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: QRIS Content */}
          {method === 'QRIS' && (
            <div className="text-center p-4 bg-white border border-[#E5DDD5] rounded-2xl space-y-3">
              <div className="inline-block p-3 bg-[#FAF7F2] rounded-2xl shadow-xs border border-[#E5DDD5]">
                <div className="w-36 h-36 bg-[#1E120D] rounded-xl p-2 flex flex-col items-center justify-center text-white relative">
                  <QrCode className="w-28 h-28 text-white" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#D4A373] absolute bottom-1">
                    QRIS WARKOP KITA
                  </span>
                </div>
              </div>
              <div>
                <p className="font-extrabold text-[#1E120D] text-sm">Warkop Kita Official QRIS</p>
                <p className="text-xs text-[#7A685D]">NMID: ID1928374650192</p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  Mendukung GoPay, OVO, DANA, BCA, Mandiri, ShopeePay
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: E-Wallet Content */}
          {method === 'E_WALLET' && (
            <div className="bg-white border border-[#E5DDD5] rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold text-[#1E120D]">Pilih E-Wallet Pelanggan:</p>
              <div className="grid grid-cols-2 gap-2">
                {['GoPay', 'OVO', 'DANA', 'ShopeePay'].map((ew) => (
                  <button
                    key={ew}
                    type="button"
                    onClick={() => setSelectedEwallet(ew)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                      selectedEwallet === ew
                        ? 'bg-[#3D2417] text-white border-[#3D2417]'
                        : 'bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E120D] border-[#E5DDD5]'
                    }`}
                  >
                    {ew}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#7A685D] text-center pt-1">
                Scan nomor handphone kasir atau notifikasi sukses transfer di akun {selectedEwallet}.
              </p>
            </div>
          )}

          {/* Selesaikan Transaksi Button */}
          <button
            type="button"
            disabled={!isPayable || isProcessing}
            onClick={handleSubmit}
            className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              !isPayable
                ? 'bg-[#D9CEBA] text-[#7A685D] cursor-not-allowed shadow-none'
                : 'bg-[#3D2417] hover:bg-[#2C1A10] text-white shadow-[#3D2417]/25 active:scale-[0.99]'
            }`}
          >
            <Printer className="w-5 h-5 text-[#E2C39B]" />
            <span>
              {isProcessing ? 'Memproses Transaksi...' : `Selesaikan & Cetak Struk (${formatRupiah(totalAmount)})`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
