import React from 'react';
import { ShoppingBag, Users } from 'lucide-react';
import { OrderType, TableNumber } from '../types';

interface OrderModeBarProps {
  orderType: OrderType;
  selectedTable: TableNumber;
  onSelectOrderType: (type: OrderType) => void;
  onSelectTable: (table: TableNumber) => void;
}

export const OrderModeBar: React.FC<OrderModeBarProps> = ({
  orderType,
  selectedTable,
  onSelectOrderType,
  onSelectTable,
}) => {
  const tables: TableNumber[] = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5DDD5] p-2.5 sm:p-3.5 mb-5 shadow-xs w-full max-w-full">
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
        {/* Order Mode Toggle: Tables vs Take Away */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Tables Card */}
          <button
            type="button"
            onClick={() => {
              onSelectOrderType('dine_in');
              if (!selectedTable) onSelectTable('T1');
            }}
            className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs ${
              orderType === 'dine_in'
                ? 'bg-[#3D2417] text-white border-[#3D2417] shadow-sm'
                : 'bg-white hover:bg-[#F5EFEB] text-[#1E120D] border-[#E5DDD5]'
            }`}
          >
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                orderType === 'dine_in'
                  ? 'bg-[#4E2E1D] text-[#E2C39B]'
                  : 'bg-[#F2ECE4] text-[#4E2E1D]'
              }`}
            >
              <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="text-left">
              <h4 className="font-extrabold text-xs sm:text-sm leading-tight">
                Tables
              </h4>
              <p
                className={`text-[10px] sm:text-xs ${
                  orderType === 'dine_in' ? 'text-[#C5B3A1]' : 'text-[#7A685D]'
                }`}
              >
                Pesan di tempat
              </p>
            </div>
          </button>

          {/* Take Away Card */}
          <button
            type="button"
            onClick={() => onSelectOrderType('take_away')}
            className={`flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs ${
              orderType === 'take_away'
                ? 'bg-[#3D2417] text-white border-[#3D2417] shadow-sm'
                : 'bg-white hover:bg-[#F5EFEB] text-[#1E120D] border-[#E5DDD5]'
            }`}
          >
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${
                orderType === 'take_away'
                  ? 'bg-[#4E2E1D] text-[#E2C39B]'
                  : 'bg-[#F2ECE4] text-[#4E2E1D]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="text-left">
              <h4 className="font-extrabold text-xs sm:text-sm leading-tight">
                Take Away
              </h4>
              <p
                className={`text-[10px] sm:text-xs ${
                  orderType === 'take_away' ? 'text-[#C5B3A1]' : 'text-[#7A685D]'
                }`}
              >
                Bawa pulang
              </p>
            </div>
          </button>
        </div>

        {/* Table Selector (When Dine In is active) - wraps inside card without overflowing */}
        {orderType === 'dine_in' ? (
          <div className="flex items-center gap-2 bg-[#F7F4EE] px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-[#E5DDD5] shrink-0 max-w-full overflow-x-auto">
            <span className="text-xs sm:text-sm font-extrabold text-[#523B2D] whitespace-nowrap">
              Pilih Meja:
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {tables.map((tbl) => {
                const isSelected = selectedTable === tbl;
                return (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => onSelectTable(tbl)}
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#3D2417] text-white shadow-xs font-black ring-2 ring-[#3D2417]/25 scale-105'
                        : 'bg-white hover:bg-[#EFE9DF] text-[#1E120D] border border-[#E5DDD5]'
                    }`}
                  >
                    {tbl}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-[#F7F4EE] px-3.5 py-2 rounded-xl sm:rounded-2xl border border-[#E5DDD5] text-xs font-semibold text-[#664C3B] shrink-0">
            <ShoppingBag className="w-4 h-4 text-[#4E2E1D]" />
            <span>Pesanan Take Away (Bawa Pulang)</span>
          </div>
        )}
      </div>
    </div>
  );
};
