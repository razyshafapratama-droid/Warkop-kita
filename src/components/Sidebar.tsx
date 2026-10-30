import React from 'react';
import { Store, Clock, Package, BarChart3, Settings, LogOut, Coffee } from 'lucide-react';

interface SidebarProps {
  activeTab: 'kasir' | 'riwayat' | 'produk' | 'laporan' | 'pengaturan';
  setActiveTab: (tab: 'kasir' | 'riwayat' | 'produk' | 'laporan' | 'pengaturan') => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const navItems = [
    { id: 'kasir' as const, label: 'Kasir', icon: Store },
    { id: 'riwayat' as const, label: 'Riwayat Transaksi', icon: Clock },
    { id: 'produk' as const, label: 'Produk', icon: Package },
    { id: 'laporan' as const, label: 'Laporan', icon: BarChart3 },
    { id: 'pengaturan' as const, label: 'Pengaturan', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#1E120D] text-white flex flex-col justify-between shrink-0 min-h-screen border-r border-[#2D1B13] select-none">
      {/* Brand Header */}
      <div>
        <div className="p-6 pb-5 flex items-center gap-3.5 border-b border-[#2C1A12]/80">
          <div className="w-11 h-11 rounded-2xl bg-[#3D2417] border border-[#5A3622] flex items-center justify-center text-[#D4A373] shadow-md shadow-black/30">
            <Coffee className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-white leading-tight font-['Plus_Jakarta_Sans']">
              Warkop Kita
            </h1>
            <p className="text-xs text-[#C5B3A1] font-medium tracking-wide">
              Ngopi, Santai, Produktif
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#3D2417] text-white shadow-md border border-[#523322] font-bold'
                    : 'text-[#C5B3A1] hover:text-white hover:bg-[#281812]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#E2C39B]' : 'text-[#9E8775]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Illustration & Logout */}
      <div className="p-5 pt-0">
        {/* Artistic coffee line drawing & handwritten quote matching reference image */}
        <div className="mb-6 px-3 py-4 rounded-2xl bg-[#281812]/50 border border-[#3A2217] relative overflow-hidden text-center">
          {/* Subtle decorative steam and cup svg */}
          <div className="flex justify-center mb-1 text-[#8C5D3B]/40">
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current stroke-1">
              <path d="M15 12C15 8 18 5 21 8C24 11 21 16 18 19" strokeLinecap="round" />
              <path d="M25 10C25 6 28 3 31 6C34 9 31 14 28 17" strokeLinecap="round" />
              <path d="M10 20H42C42 28 36 34 26 34C16 34 10 28 10 20Z" />
              <path d="M42 22C46 22 49 24 49 27C49 30 46 32 42 32" strokeLinecap="round" />
              <path d="M6 35H46" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-script text-base text-[#D4A373] tracking-wide leading-tight -rotate-2">
            "Kopi enak, Harga pas, Pelayanan puas"
          </p>
        </div>

        {/* Keluar (Logout) button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#A89280] hover:text-[#FF7D7D] hover:bg-[#2A1710] transition-colors cursor-pointer border border-transparent hover:border-[#4A241B]"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};
