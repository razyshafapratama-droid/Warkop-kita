import React, { useState } from 'react';
import { Plus, Coffee, Check } from 'lucide-react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  onAddToCart,
}) => {
  const [imageError, setImageError] = useState(false);
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) onAddToCart(product);
      }}
      className={`group bg-white rounded-2xl p-3 sm:p-3.5 border border-[#E5DDD5] hover:border-[#8C5D3B] hover:shadow-md transition-all duration-200 select-none flex flex-col justify-between cursor-pointer relative ${
        isOutOfStock ? 'opacity-60 cursor-not-allowed bg-[#FAF7F2]' : ''
      }`}
    >
      {/* Badge if item is in cart */}
      {cartQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#3D2417] text-[#E2C39B] font-black text-xs px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 z-10 border border-[#5A3824]">
          <Check className="w-3 h-3 stroke-[3]" />
          {cartQuantity}x
        </span>
      )}

      <div>
        {/* Product Image Frame matching reference */}
        <div className="w-full h-32 sm:h-36 rounded-xl bg-[#F2ECE4] overflow-hidden mb-3 relative flex items-center justify-center border border-[#EBE3DA]">
          {product.image && !imageError ? (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImageError(true)}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="p-3 bg-white rounded-xl shadow-xs border border-[#E5DDD5] text-[#4A2C1D]">
              <Coffee className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Product Name */}
        <h4 className="font-extrabold text-sm sm:text-base text-[#1E120D] leading-snug truncate group-hover:text-[#6F4E37] transition-colors">
          {product.name}
        </h4>

        {/* Short Description */}
        <p className="text-xs text-[#8C7A6B] line-clamp-1 mt-0.5 min-h-[16px]">
          {product.description || `Pilihan menu terbaik khas warkop`}
        </p>

        {/* Price */}
        <p className="font-black text-[#1E120D] text-sm sm:text-base mt-1.5 font-['Plus_Jakarta_Sans']">
          {formatRupiah(product.price)}
        </p>
      </div>

      {/* Button: + Tambah matching reference */}
      <button
        type="button"
        disabled={isOutOfStock}
        onClick={(e) => {
          e.stopPropagation();
          if (!isOutOfStock) onAddToCart(product);
        }}
        className={`w-full mt-3 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
          isOutOfStock
            ? 'bg-[#E5DDD5] text-[#9E8775] cursor-not-allowed'
            : 'bg-[#4A2C1D] hover:bg-[#3D2417] text-white active:scale-[0.98]'
        }`}
      >
        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>+ Tambah</span>
      </button>
    </div>
  );
};
