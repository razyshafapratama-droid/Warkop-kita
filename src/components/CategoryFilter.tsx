import React from 'react';
import { LayoutGrid, Coffee, CupSoda, Leaf, Milk, Popcorn, UtensilsCrossed } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories = [
    { id: 'Semua', label: 'Semua', icon: LayoutGrid },
    { id: 'Kopi', label: 'Kopi', icon: Coffee },
    { id: 'Non Kopi', label: 'Non Kopi', icon: CupSoda },
    { id: 'Teh', label: 'Teh', icon: Leaf },
    { id: 'Susu', label: 'Susu', icon: Milk },
    { id: 'Camilan', label: 'Camilan', icon: Popcorn },
    { id: 'Makanan', label: 'Makanan', icon: UtensilsCrossed },
  ];

  return (
    <div className="mb-6">
      <h3 className="font-extrabold text-base sm:text-lg text-[#1E120D] mb-3">
        Kategori
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`p-3 sm:p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-[#3D2417] text-white shadow-sm border border-[#3D2417]'
                  : 'bg-white hover:bg-[#F5EFEB] text-[#1E120D] border border-[#E5DDD5]'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? 'text-[#E2C39B]' : 'text-[#4A2C1D]'
                }`}
              />
              <span className="text-xs font-bold tracking-tight">
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
