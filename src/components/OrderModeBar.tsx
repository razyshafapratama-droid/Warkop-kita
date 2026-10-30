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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-transparent">
      {/* Order Mode Toggle Cards: Tables vs Take Away */}
      <div className="flex items-center gap-3">
        {/* Tables Card */}
        <button
          type="button"
          onClick={() => {
            onSelectOrderType('dine_in');
            if (!selectedTable) onSelectTable('T1');
          }}
          className={`flex items-center gap-3.5 px-5 py-3 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs ${
            orderType === 'dine_in'
              ? 'bg-[#3D2417] text-white border-[#3D2417] shadow-sm'
              : 'bg-white hover:bg-[#F5EFEB] text-[#1E120D] border-[#E5DDD5]'
          }`}
        >
          {/* Table with chairs icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              orderType === 'dine_in'
                ? 'bg-[#4E2E1D] text-[#E2C39B]'
                : 'bg-[#F2ECE4] text-[#4E2E1D]'
            }`}
          >
            <Users className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="font-extrabold text-sm sm:text-base leading-tight">
              Tables
            </h4>
            <p
              className={`text-xs ${
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
          className={`flex items-center gap-3.5 px-5 py-3 rounded-2xl border transition-all duration-200 cursor-pointer shadow-xs ${
            orderType === 'take_away'
              ? 'bg-[#3D2417] text-white border-[#3D2417] shadow-sm'
              : 'bg-white hover:bg-[#F5EFEB] text-[#1E120D] border-[#E5DDD5]'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              orderType === 'take_away'
                ? 'bg-[#4E2E1D] text-[#E2C39B]'
                : 'bg-[#F2ECE4] text-[#4E2E1D]'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="font-extrabold text-sm sm:text-base leading-tight">
              Take Away
            </h4>
            <p
              className={`text-xs ${
                orderType === 'take_away' ? 'text-[#C5B3A1]' : 'text-[#7A685D]'
              }`}
            >
              Bawa pulang
            </p>
          </div>
        </button>
      </div>

      {/* Table Selector (When Dine In / Tables is active) */}
      {orderType === 'dine_in' ? (
        <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-[#E5DDD5] shadow-xs">
          <span className="text-xs sm:text-sm font-bold text-[#7A685D] mr-1 whitespace-nowrap">
            Pilih Meja:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {tables.map((tbl) => {
              const isSelected = selectedTable === tbl;
              return (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => onSelectTable(tbl)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#3D2417] text-white shadow-xs font-black'
                      : 'bg-[#F7F4EE] hover:bg-[#EFE9DF] text-[#1E120D] border border-[#E5DDD5]'
                  }`}
                >
                  {tbl}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex items-center gap-2 bg-[#F2ECE4]/70 px-4 py-2.5 rounded-2xl border border-[#E2D8CC] text-xs font-semibold text-[#664C3B]">
          <ShoppingBag className="w-4 h-4 text-[#4E2E1D]" />
          <span>Pesanan Take Away (Tanpa Meja)</span>
        </div>
      )}
    </div>
  );
};
