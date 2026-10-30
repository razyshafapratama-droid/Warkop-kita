import React, { useState } from 'react';
import { Search, Printer, FileText, Users, ShoppingBag } from 'lucide-react';
import { Transaction } from '../types';
import { formatDate, formatRupiah } from '../utils/formatters';

interface TransactionHistoryViewProps {
  transactions: Transaction[];
  onSelectTransaction: (trx: Transaction) => void;
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('Semua');
  const [selectedType, setSelectedType] = useState<string>('Semua');

  const filtered = transactions.filter((t) => {
    const matchSearch =
      t.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.cashierName.toLowerCase().includes(search.toLowerCase()) ||
      (t.tableNumber && t.tableNumber.toLowerCase().includes(search.toLowerCase())) ||
      t.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));

    const matchMethod = selectedMethod === 'Semua' || t.paymentMethod === selectedMethod;
    const matchType =
      selectedType === 'Semua' ||
      (selectedType === 'dine_in' && t.orderType === 'dine_in') ||
      (selectedType === 'take_away' && t.orderType === 'take_away');

    return matchSearch && matchMethod && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-[#E5DDD5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E120D] tracking-tight">
            Riwayat Transaksi Warkop
          </h2>
          <p className="text-xs text-[#7A685D] mt-0.5">
            Daftar pesanan pelanggan meja (T1-T6) dan pesanan bawa pulang (Take Away).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1E120D] bg-[#F7F4EE] px-4 py-2 rounded-2xl border border-[#E5DDD5]">
            Total {transactions.length} Transaksi Tercatat
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5DDD5] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E8775]" />
          <input
            type="text"
            placeholder="Cari no nota, meja, atau menu kopi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DDD5] rounded-2xl text-[#1E120D] placeholder-[#A49182] focus:outline-none focus:border-[#4A2C1D] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Order Type Filter */}
          <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-2xl border border-[#E5DDD5] text-xs font-bold">
            <button
              onClick={() => setSelectedType('Semua')}
              className={`px-3 py-1 rounded-xl cursor-pointer ${
                selectedType === 'Semua' ? 'bg-[#3D2417] text-white' : 'text-[#7A685D] hover:text-[#1E120D]'
              }`}
            >
              Semua Tipe
            </button>
            <button
              onClick={() => setSelectedType('dine_in')}
              className={`px-3 py-1 rounded-xl cursor-pointer ${
                selectedType === 'dine_in' ? 'bg-[#3D2417] text-white' : 'text-[#7A685D] hover:text-[#1E120D]'
              }`}
            >
              Dine In
            </button>
            <button
              onClick={() => setSelectedType('take_away')}
              className={`px-3 py-1 rounded-xl cursor-pointer ${
                selectedType === 'take_away' ? 'bg-[#3D2417] text-white' : 'text-[#7A685D] hover:text-[#1E120D]'
              }`}
            >
              Take Away
            </button>
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center gap-1">
            {['Semua', 'TUNAI', 'QRIS', 'E_WALLET'].map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                  selectedMethod === method
                    ? 'bg-[#3D2417] text-white'
                    : 'bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#7A685D] border border-[#E5DDD5]'
                }`}
              >
                {method === 'E_WALLET' ? 'E-Wallet' : method}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E5DDD5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5DDD5] text-[#7A685D] font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">No. Nota</th>
                <th className="py-3.5 px-4">Tipe / Meja</th>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Pesanan Menu</th>
                <th className="py-3.5 px-4">Metode</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4 text-center">Struk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE2] text-[#1E120D]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#9E8775]">
                    <FileText className="w-10 h-10 mx-auto text-[#BAA688] mb-2" />
                    <p className="font-bold text-[#1E120D]">Tidak Ada Transaksi</p>
                    <p className="text-xs text-[#8C7A6B]">Belum ada pesanan yang cocok dengan filter yang dipilih.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => onSelectTransaction(t)}
                    className="hover:bg-[#FAF7F2]/80 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1E120D]">
                      {t.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      {t.orderType === 'dine_in' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#F2ECE4] text-[#4A2C1D] border border-[#E2D8CC]">
                          <Users className="w-3.5 h-3.5" />
                          <span>Meja {t.tableNumber || 'T1'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-[#FAF7F2] text-[#7A685D] border border-[#E5DDD5]">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Take Away</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#7A685D]">
                      {formatDate(t.timestamp)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[#523B2D] font-medium line-clamp-1 max-w-[220px]">
                        {t.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-xl text-[11px] font-bold ${
                          t.paymentMethod === 'TUNAI'
                            ? 'bg-[#EFE9DF] text-[#3D2417]'
                            : t.paymentMethod === 'QRIS'
                            ? 'bg-indigo-50 text-indigo-900 border border-indigo-100'
                            : 'bg-emerald-50 text-emerald-900 border border-emerald-100'
                        }`}
                      >
                        {t.paymentMethod === 'E_WALLET' ? 'E-Wallet' : t.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#1E120D] font-['Plus_Jakarta_Sans']">
                      {formatRupiah(t.total)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTransaction(t);
                        }}
                        className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#3D2417] transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-bold border border-[#E5DDD5]"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#6F4E37]" />
                        <span>Cetak</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
