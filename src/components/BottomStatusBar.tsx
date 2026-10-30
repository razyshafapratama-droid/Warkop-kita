import React from 'react';
import { Users, ShoppingBag } from 'lucide-react';
import { OrderType, TableNumber } from '../types';
import { formatRupiah } from '../utils/formatters';

interface BottomStatusBarProps {
  orderType: OrderType;
  selectedTable: TableNumber;
  totalItemsCount: number;
  grandTotal: number;
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({
  orderType,
  selectedTable,
  totalItemsCount,
  grandTotal,
}) => {
  return (
    <footer className="mt-6 bg-white border border-[#E5DDD5] rounded-2xl px-5 py-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm select-none">
      {/* Table / Order Type Info */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-[#F2ECE4] text-[#4A2C1D] flex items-center justify-center">
          {orderType === 'dine_in' ? (
            <Users className="w-4 h-4" />
          ) : (
            <ShoppingBag className="w-4 h-4" />
          )}
        </div>
        <div>
          <span className="font-extrabold text-[#1E120D] text-sm">
            {orderType === 'dine_in' ? `Meja ${selectedTable || 'T1'}` : 'Pesanan Take Away'}
          </span>
          <span className="text-[#8C7A6B] ml-2 text-xs font-semibold">
            {orderType === 'dine_in' ? 'Dine In' : 'Bawa Pulang'}
          </span>
        </div>
      </div>

      {/* Middle Item & Total Indicator */}
      <div className="flex items-center gap-4 text-[#7A685D] font-medium">
        <span>
          Jumlah Item:{' '}
          <strong className="text-[#1E120D] font-extrabold">{totalItemsCount}</strong>
        </span>
        <span className="text-[#D9CEBA]">&bull;</span>
        <span>
          Total:{' '}
          <strong className="text-[#1E120D] font-extrabold font-['Plus_Jakarta_Sans']">
            {formatRupiah(grandTotal)}
          </strong>
        </span>
      </div>

      {/* Right Sync & Storage Indicator matching reference */}
      <div className="flex items-center gap-2 text-xs text-[#523B2D] font-semibold">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Data tersimpan di browser</span>
      </div>
    </footer>
  );
};
