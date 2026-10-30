import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronDown, User, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types';

interface TopHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: UserAccount;
  onOpenUserModal: () => void;
  title?: string;
  subtitle?: string;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  onSearchChange,
  currentUser,
  onOpenUserModal,
  title = 'Kasir',
  subtitle = 'Pilih produk dan lakukan transaksi',
}) => {
  const [currentDateTime, setCurrentDateTime] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: "Senin, 27 Okt 2025"
      const dateFormatted = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      // Format: "20:52"
      const timeFormatted = now.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentDateTime(dateFormatted);
      setCurrentTime(timeFormatted);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Title & Subtitle */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E120D] tracking-tight font-['Plus_Jakarta_Sans']">
          {title}
        </h2>
        <p className="text-xs sm:text-sm text-[#7A685D] font-medium mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Center: Search Bar matching reference image */}
      <div className="flex-1 max-w-md w-full">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#9E8775]" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#E5DDD5] rounded-2xl text-xs sm:text-sm text-[#1E120D] placeholder-[#A49182] focus:outline-none focus:ring-2 focus:ring-[#4A2C1D]/20 focus:border-[#4A2C1D] shadow-xs transition-all"
          />
        </div>
      </div>

      {/* Right: Date Time Badge & User Profile Dropdown */}
      <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
        {/* Date Time Badge in dark brown pill */}
        <div className="bg-[#261811] text-white px-4 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm text-xs sm:text-sm font-semibold tracking-wide">
          <Calendar className="w-4 h-4 text-[#D4A373] shrink-0" />
          <span>{currentDateTime}</span>
          <span className="font-bold text-[#E2C39B] pl-1 border-l border-[#4A3226]">
            {currentTime}
          </span>
        </div>

        {/* User Profile Badge */}
        <button
          onClick={onOpenUserModal}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-white hover:bg-[#F2ECE4] border border-[#E5DDD5] transition-colors cursor-pointer shadow-xs"
        >
          <div className="w-9 h-9 rounded-full bg-[#261811] text-[#E2C39B] flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser.role === 'admin' ? (
              <ShieldCheck className="w-4 h-4" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
          <div className="text-left hidden sm:block">
            <span className="block font-bold text-xs text-[#1E120D] leading-tight">
              {currentUser.name}
            </span>
            <span className="block text-[11px] text-[#7A685D] capitalize leading-none mt-0.5">
              {currentUser.role === 'admin' ? 'Kasir / Admin' : 'Kasir Shift'}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-[#7A685D] ml-0.5" />
        </button>
      </div>
    </header>
  );
};
