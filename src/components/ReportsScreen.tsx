import React, { useState, useMemo } from 'react';
import { Award, Download, DollarSign, Receipt, Package, TrendingUp, Users } from 'lucide-react';
import { Product, Transaction, UserRole } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';

interface ReportsScreenProps {
  transactions: Transaction[];
  products: Product[];
  userRole: UserRole;
  onViewTransactionDetail: (trx: Transaction) => void;
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({
  transactions,
  products,
  userRole,
  onViewTransactionDetail,
}) => {
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('today');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    return transactions.filter((t) => {
      const txTime = new Date(t.timestamp).getTime();
      if (period === 'today') return txTime >= todayStart;
      if (period === 'week') return txTime >= todayStart - 7 * 86400000;
      if (period === 'month') return txTime >= todayStart - 30 * 86400000;
      return true;
    });
  }, [transactions, period]);

  const totalOmzet = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + (t.total || 0), 0);
  }, [filteredTransactions]);

  const totalTransactionsCount = filteredTransactions.length;

  const totalItemsSold = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      return acc + t.items.reduce((sum, item) => sum + item.quantity, 0);
    }, 0);
  }, [filteredTransactions]);

  const totalProfit = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => {
      const costForTx = t.items.reduce((sum, item) => {
        const itemCost = item.cost || Math.round(item.price * 0.5);
        return sum + itemCost * item.quantity;
      }, 0);
      return acc + (t.total - costForTx);
    }, 0);
  }, [filteredTransactions]);

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; quantity: number; revenue: number }> = {};
    filteredTransactions.forEach((t) => {
      t.items.forEach((item) => {
        if (!map[item.productId]) {
          map[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
        }
        map[item.productId].quantity += item.quantity;
        map[item.productId].revenue += item.subtotal;
      });
    });

    return Object.values(map)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredTransactions]);

  const maxSoldQty = topProducts.length > 0 ? topProducts[0].quantity : 1;

  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ['No Nota', 'Waktu', 'Tipe', 'Meja', 'Metode Bayar', 'Total Belanja (Rp)', 'Item'];
    const rows = filteredTransactions.map((t) => [
      t.invoiceNumber,
      `"${formatDate(t.timestamp)}"`,
      t.orderType,
      t.tableNumber || 'Take Away',
      t.paymentMethod,
      t.total,
      `"${t.items.map((i) => `${i.name} (${i.quantity})`).join(', ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan-Warkop-${period}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-[#E5DDD5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E120D] tracking-tight">
            Laporan Omzet & Penjualan Warkop
          </h2>
          <p className="text-xs text-[#7A685D] mt-0.5">
            Analisis penjualan kopi, minuman, dan camilan warkop secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-2xl border border-[#E5DDD5] text-xs font-bold text-[#7A685D]">
            <button
              onClick={() => setPeriod('today')}
              className={`px-3 py-1.5 rounded-xl cursor-pointer ${
                period === 'today' ? 'bg-[#3D2417] text-white' : 'hover:text-[#1E120D]'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-3 py-1.5 rounded-xl cursor-pointer ${
                period === 'week' ? 'bg-[#3D2417] text-white' : 'hover:text-[#1E120D]'
              }`}
            >
              7 Hari
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3 py-1.5 rounded-xl cursor-pointer ${
                period === 'month' ? 'bg-[#3D2417] text-white' : 'hover:text-[#1E120D]'
              }`}
            >
              30 Hari
            </button>
            <button
              onClick={() => setPeriod('all')}
              className={`px-3 py-1.5 rounded-xl cursor-pointer ${
                period === 'all' ? 'bg-[#3D2417] text-white' : 'hover:text-[#1E120D]'
              }`}
            >
              Semua
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-[#3D2417] hover:bg-[#2C1A10] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#E2C39B]" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#E5DDD5] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#7A685D] uppercase tracking-wider">Total Omzet</span>
          <p className="text-2xl font-black text-[#1E120D] mt-2 font-['Plus_Jakarta_Sans']">{formatRupiah(totalOmzet)}</p>
          <p className="text-xs text-[#6F4E37] font-bold mt-1">{totalTransactionsCount} Pesanan Selesai</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5DDD5] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#7A685D] uppercase tracking-wider">Cangkir / Porsi</span>
          <p className="text-2xl font-black text-[#1E120D] mt-2 font-['Plus_Jakarta_Sans']">{totalItemsSold} <span className="text-sm font-semibold text-[#7A685D]">terjual</span></p>
          <p className="text-xs text-[#7A685D] mt-1">Katalog {products.length} menu</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5DDD5] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#7A685D] uppercase tracking-wider">Estimasi Laba Bersih</span>
          <p className="text-2xl font-black text-[#4A2C1D] mt-2 font-['Plus_Jakarta_Sans']">{formatRupiah(totalProfit)}</p>
          <p className="text-xs text-[#6F4E37] font-semibold mt-1">Margin warkop: ~50%</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#E5DDD5] shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-[#7A685D] uppercase tracking-wider">Rata-Rata Nota</span>
          <p className="text-2xl font-black text-[#1E120D] mt-2 font-['Plus_Jakarta_Sans']">
            {formatRupiah(totalTransactionsCount > 0 ? Math.round(totalOmzet / totalTransactionsCount) : 0)}
          </p>
          <p className="text-xs text-[#7A685D] mt-1">Per pesanan meja / bawa pulang</p>
        </div>
      </div>

      {/* Top 5 Best Sellers */}
      <div className="bg-white p-6 rounded-3xl border border-[#E5DDD5] shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-[#D4A373]" />
          <h3 className="font-extrabold text-[#1E120D] text-base">Menu Warkop Terlaris (Favorit Pelanggan)</h3>
        </div>

        {topProducts.length === 0 ? (
          <p className="text-xs text-[#7A685D] text-center py-6">Belum ada data penjualan pada periode ini.</p>
        ) : (
          <div className="space-y-3.5">
            {topProducts.map((p, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FAF7F2] border border-[#E5DDD5] flex items-center justify-center text-xs font-bold text-[#3D2417]">
                      {idx + 1}
                    </span>
                    <span className="font-extrabold text-[#1E120D]">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#1E120D]">{p.quantity} cup/porsi</span>
                    <span className="text-xs text-[#7A685D] ml-2">({formatRupiah(p.revenue)})</span>
                  </div>
                </div>
                <div className="w-full bg-[#FAF7F2] h-2.5 rounded-full overflow-hidden border border-[#E5DDD5]">
                  <div
                    className="bg-[#4A2C1D] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round((p.quantity / maxSoldQty) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
