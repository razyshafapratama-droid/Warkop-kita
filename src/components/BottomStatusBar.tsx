import React from 'react';
import { Users, ShoppingBag } from 'lucide-react';
import { OrderType, TableNumber } from '../types';
import { formatRupiah } from '../utils/formatters';

interface BottomStatusBarProps {
  orderType: OrderType;
  selectedTable: TableNumber;
  totalItemsCount: number;
  grandTotal: number;
  onSelectTable?: (table: TableNumber) => void;
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({
  orderType,
  selectedTable,
  totalItemsCount,
  grandTotal,
  onSelectTable,
}) => {
  return (
    <div className="w-full bg-white border border-[#E5DDD5] rounded-2xl px-4 py-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2.5 text-xs select-none">
      {/* Table / Order Type Info with circular avatar icon */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-[#F2ECE4] text-[#4A2C1D] flex items-center justify-center shrink-0 border border-[#E5DDD5]">
          {orderType === 'dine_in' ? (
            <Users className="w-3.5 h-3.5" />
          ) : (
            <ShoppingBag className="w-3.5 h-3.5" />
          )}
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          {orderType === 'dine_in' ? (
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[#1E120D] text-xs sm:text-sm">
                Meja
              </span>
              {onSelectTable ? (
                <select
                  value={selectedTable || 'T1'}
                  onChange={(e) => onSelectTable(e.target.value as TableNumber)}
                  className="bg-[#F7F4EE] hover:bg-[#EFE9DF] text-[#1E120D] font-black text-xs px-2 py-0.5 rounded-lg border border-[#DACFBF] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#3D2417]"
                  title="Ganti Pilihan Meja"
                >
                  {(['T1', 'T2', 'T3', 'T4', 'T5', 'T6'] as const).map((tbl) => (
                    <option key={tbl} value={tbl}>
                      {tbl}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="font-black text-[#1E120D] text-xs sm:text-sm">
                  {selectedTable || 'T1'}
                </span>
              )}
              <span className="text-[#8C7A6B] text-[11px] font-semibold">
                (Dine In)
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-[#1E120D] text-xs sm:text-sm">
                Take Away
              </span>
              <span className="text-[#8C7A6B] text-[11px] font-semibold">
                Bawa Pulang
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Middle Item & Total Indicator */}
      <div className="flex items-center gap-2 text-[#7A685D] text-xs font-medium whitespace-nowrap">
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

      {/* Right Sync & Storage Indicator */}
      <div className="flex items-center gap-1.5 text-[11px] text-[#523B2D] font-semibold whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        <span>Data tersimpan di browser</span>
      </div>
    </div>
  );
};
