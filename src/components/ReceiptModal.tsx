import React, { useState } from 'react';
import { Printer, Copy, Check, Plus, X, Download } from 'lucide-react';
import { StoreSettings, Transaction } from '../types';
import { formatDate, formatRupiah } from '../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  storeSettings: StoreSettings;
  onClose: () => void;
  onNewTransaction: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  transaction,
  storeSettings,
  onClose,
  onNewTransaction,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateReceiptPlainText = () => {
    const divider = '--------------------------------';
    let text = `${storeSettings.storeName.toUpperCase()}\n`;
    text += `${storeSettings.tagline}\n`;
    text += `${storeSettings.address}\n`;
    text += `Telp: ${storeSettings.phone}\n`;
    text += `${divider}\n`;
    text += `No. Nota : ${transaction.invoiceNumber}\n`;
    text += `Tipe     : ${transaction.orderType === 'dine_in' ? `Meja ${transaction.tableNumber || 'T1'} (Dine In)` : 'Take Away'}\n`;
    text += `Waktu    : ${formatDate(transaction.timestamp)}\n`;
    text += `Kasir    : ${transaction.cashierName}\n`;
    text += `${divider}\n`;

    transaction.items.forEach((item) => {
      text += `${item.name}\n`;
      text += `  ${item.quantity} x ${formatRupiah(item.price)} = ${formatRupiah(item.subtotal)}\n`;
    });

    text += `${divider}\n`;
    text += `Subtotal  : ${formatRupiah(transaction.subtotal)}\n`;
    if (transaction.tax > 0) {
      text += `Pajak 10% : ${formatRupiah(transaction.tax)}\n`;
    }
    text += `TOTAL     : ${formatRupiah(transaction.total)}\n`;
    text += `Bayar (${transaction.paymentMethod}) : ${formatRupiah(transaction.amountPaid)}\n`;
    text += `Kembali   : ${formatRupiah(transaction.change)}\n`;
    text += `${divider}\n`;
    text += `${storeSettings.receiptFooterMessage}\n`;
    return text;
  };

  const handleCopyText = () => {
    const text = generateReceiptPlainText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    const text = generateReceiptPlainText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Struk-${transaction.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E120D]/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E5DDD5] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#1E120D] text-white p-4 px-5 flex items-center justify-between no-print border-b border-[#2C1A12]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E2C39B]" />
            <h3 className="font-extrabold text-sm text-white">Struk Transaksi Selesai</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#2C1A12] hover:bg-[#3D2417] flex items-center justify-center text-[#C5B3A1] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Receipt Preview (Thermal Paper Monospace) */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-[#F7F4EE] flex-1 flex justify-center">
          <div
            id="thermal-receipt"
            className="w-full max-w-[340px] bg-white p-5 rounded-2xl shadow-sm border border-[#E5DDD5] text-slate-800 font-mono text-xs select-text leading-relaxed"
          >
            {/* Store Info */}
            <div className="text-center pb-3 border-b border-dashed border-[#A49182]">
              <h2 className="font-extrabold text-base tracking-tight text-[#1E120D]">
                {storeSettings.storeName.toUpperCase()}
              </h2>
              <p className="text-[11px] text-[#5A3824] font-medium mt-0.5">{storeSettings.tagline}</p>
              <p className="text-[10px] text-slate-500 mt-1">{storeSettings.address}</p>
              <p className="text-[10px] text-slate-500">Telp: {storeSettings.phone}</p>
            </div>

            {/* Meta info: No. Nota, Meja, Waktu, Kasir */}
            <div className="py-2.5 border-b border-dashed border-[#A49182] space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-bold text-[#1E120D]">{transaction.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Pesanan:</span>
                <span className="font-bold text-[#4A2C1D]">
                  {transaction.orderType === 'dine_in' ? `Meja ${transaction.tableNumber || 'T1'}` : 'Take Away'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span>{formatDate(transaction.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{transaction.cashierName}</span>
              </div>
            </div>

            {/* Items */}
            <div className="py-2.5 border-b border-dashed border-[#A49182] space-y-2">
              {transaction.items.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="font-bold text-slate-900">{item.name}</div>
                  <div className="flex justify-between text-slate-600">
                    <span>
                      {item.quantity} x {formatRupiah(item.price)}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations: Subtotal, Pajak 10%, Total, Bayar, Kembali */}
            <div className="py-2.5 border-b border-dashed border-[#A49182] space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatRupiah(transaction.subtotal)}</span>
              </div>
              {transaction.tax > 0 && (
                <div className="flex justify-between">
                  <span>Pajak 10%</span>
                  <span>{formatRupiah(transaction.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-sm pt-1 border-t border-dotted border-slate-300 text-[#1E120D]">
                <span>TOTAL</span>
                <span>{formatRupiah(transaction.total)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Bayar ({transaction.paymentMethod})</span>
                <span>{formatRupiah(transaction.amountPaid)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-950">
                <span>KEMBALI</span>
                <span>{formatRupiah(transaction.change)}</span>
              </div>
            </div>

            {/* Footer Message */}
            <div className="pt-3 text-center text-[10px] text-slate-500 whitespace-pre-line leading-normal">
              {storeSettings.receiptFooterMessage}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 bg-white border-t border-[#E5DDD5] space-y-2 no-print">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-2xl bg-[#3D2417] hover:bg-[#2C1A10] text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-[#E2C39B]" />
              <span>Cetak Thermal</span>
            </button>

            <button
              onClick={handleCopyText}
              className="py-2.5 px-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E120D] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer border border-[#E5DDD5] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#7A685D]" />
                  <span>Salin Struk (WA)</span>
                </>
              )}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadText}
              className="py-2 px-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#7A685D] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#E5DDD5] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Simpan TXT</span>
            </button>

            <button
              onClick={onNewTransaction}
              className="flex-1 py-2.5 px-4 rounded-2xl bg-[#6F4E37] hover:bg-[#5A3824] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md shadow-[#6F4E37]/20 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Pesanan Baru</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
