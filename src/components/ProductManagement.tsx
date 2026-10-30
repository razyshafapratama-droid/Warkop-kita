import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, ArrowUpRight, Box, ShieldAlert, Image as ImageIcon, Upload, X } from 'lucide-react';
import { Product, UserRole } from '../types';
import { formatRupiah } from '../utils/formatters';

interface ProductManagementProps {
  products: Product[];
  userRole: UserRole;
  onSaveProduct: (product: Partial<Product> & { name: string; price: number }) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onRestockProduct: (id: string, additionalQty: number) => Promise<void>;
  onRequestAdminAccess: () => void;
}

const WARKOP_IMAGE_PRESETS = [
  { label: 'Kopi Hitam', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', cat: 'Kopi' },
  { label: 'Kopi Susu', url: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80', cat: 'Kopi' },
  { label: 'Americano', url: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80', cat: 'Kopi' },
  { label: 'Cappuccino', url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=600&q=80', cat: 'Kopi' },
  { label: 'Latte', url: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80', cat: 'Kopi' },
  { label: 'Mochaccino', url: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80', cat: 'Kopi' },
  { label: 'Matcha Latte', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80', cat: 'Non Kopi' },
  { label: 'Es Teh Manis', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80', cat: 'Teh' },
  { label: 'Es Cokelat', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80', cat: 'Non Kopi' },
  { label: 'Susu Cokelat', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80', cat: 'Susu' },
  { label: 'Taro Latte', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80', cat: 'Non Kopi' },
  { label: 'Roti Bakar', url: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80', cat: 'Camilan' },
  { label: 'Pisang Goreng Keju', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80', cat: 'Camilan' },
  { label: 'Kentang Goreng', url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80', cat: 'Camilan' },
  { label: 'Indomie Goreng Telur', url: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80', cat: 'Makanan' },
  { label: 'Indomie Kuah Rebus', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', cat: 'Makanan' },
];

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  userRole,
  onSaveProduct,
  onDeleteProduct,
  onRestockProduct,
  onRequestAdminAccess,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [restockProductTarget, setRestockProductTarget] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    description: string;
    price: number;
    cost: number;
    stock: number;
    unit: string;
    barcode: string;
    image: string;
  }>({
    name: '',
    category: 'Kopi',
    description: '',
    price: 0,
    cost: 0,
    stock: 25,
    unit: 'cup',
    barcode: '',
    image: '',
  });

  const categories = ['Semua', 'Kopi', 'Non Kopi', 'Teh', 'Susu', 'Camilan', 'Makanan'];

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));

    const matchCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const openCreateModal = () => {
    if (userRole !== 'admin') {
      onRequestAdminAccess();
      return;
    }
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Kopi',
      description: 'Perpaduan kopi berkualitas khas Warkop Kita',
      price: 10000,
      cost: 5000,
      stock: 30,
      unit: 'cup',
      barcode: `WK-${Math.floor(100 + Math.random() * 900)}`,
      image: WARKOP_IMAGE_PRESETS[0].url,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    if (userRole !== 'admin') {
      onRequestAdminAccess();
      return;
    }
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description || '',
      price: product.price,
      cost: product.cost || Math.round(product.price * 0.5),
      stock: product.stock,
      unit: product.unit || 'cup',
      barcode: product.barcode || '',
      image: product.image || '',
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, image: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) return;

    await onSaveProduct({
      ...(editingProduct ? { id: editingProduct.id } : {}),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      cost: Number(formData.cost) || Math.round(Number(formData.price) * 0.5),
      stock: Number(formData.stock),
      unit: formData.unit,
      barcode: formData.barcode,
      image: formData.image || undefined,
    });

    setIsModalOpen(false);
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockProductTarget || restockQty <= 0) return;
    await onRestockProduct(restockProductTarget.id, restockQty);
    setRestockProductTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl border border-[#E5DDD5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-[#1E120D] tracking-tight">
              Manajemen Menu & Stok Warkop
            </h2>
            {userRole === 'admin' ? (
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#3D2417] text-[#E2C39B]">
                Akses Admin
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#7A685D] border border-[#E5DDD5]">
                Kasir (Lihat & Restock)
              </span>
            )}
          </div>
          <p className="text-xs text-[#7A685D] mt-0.5">
            Atur daftar minuman, makanan, harga jual, dan stok bahan warkop.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {userRole !== 'admin' && (
            <button
              onClick={onRequestAdminAccess}
              className="px-3.5 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Buka Akses Admin</span>
            </button>
          )}

          <button
            onClick={openCreateModal}
            className="px-4 py-2.5 rounded-2xl bg-[#3D2417] hover:bg-[#2C1A10] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-[#3D2417]/20 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3] text-[#E2C39B]" />
            <span>Tambah Menu Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-[#E5DDD5] shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9E8775]" />
            <input
              type="text"
              placeholder="Cari nama menu, barcode, atau kategori..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#FAF7F2] border border-[#E5DDD5] rounded-2xl text-[#1E120D] placeholder-[#A49182] focus:outline-none focus:border-[#4A2C1D] transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#3D2417] text-white shadow-xs'
                  : 'bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#7A685D] border border-[#E5DDD5]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-[#E5DDD5] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5DDD5] text-[#7A685D] font-bold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Menu</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-right">Harga Jual</th>
                {userRole === 'admin' && <th className="py-3.5 px-4 text-right">Harga Modal</th>}
                <th className="py-3.5 px-4 text-center">Stok</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE2] text-[#1E120D]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9E8775]">
                    <Box className="w-10 h-10 mx-auto text-[#BAA688] mb-2" />
                    <p className="font-bold text-[#1E120D]">Tidak Ada Menu Ditemukan</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80'}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#EBE3DA] shrink-0"
                          />
                          <div>
                            <div className="font-extrabold text-[#1E120D] text-sm">{p.name}</div>
                            <div className="text-[11px] text-[#7A685D] line-clamp-1">{p.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-xl text-xs font-bold bg-[#FAF7F2] text-[#4A2C1D] border border-[#E5DDD5]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-black text-[#1E120D] font-['Plus_Jakarta_Sans']">
                        {formatRupiah(p.price)}
                      </td>
                      {userRole === 'admin' && (
                        <td className="py-3 px-4 text-right text-[#7A685D] font-['Plus_Jakarta_Sans']">
                          {formatRupiah(p.cost || Math.round(p.price * 0.5))}
                        </td>
                      )}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            isOutOfStock
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {isOutOfStock ? 'Habis (0)' : `${p.stock} ${p.unit}`}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setRestockProductTarget(p);
                              setRestockQty(10);
                            }}
                            className="p-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#4A2C1D] border border-[#E5DDD5] transition-colors cursor-pointer"
                            title="Restock"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E120D] border border-[#E5DDD5] transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {userRole === 'admin' && (
                            <button
                              onClick={() => setDeleteConfirmId(p.id)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 transition-colors cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E120D]/80 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E5DDD5] my-8">
            <div className="bg-[#1E120D] text-white p-4 px-5 flex items-center justify-between border-b border-[#2C1A12]">
              <h3 className="font-extrabold text-sm sm:text-base text-white">
                {editingProduct ? 'Ubah Menu Warkop' : 'Tambah Menu Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#C5B3A1] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-4 text-xs sm:text-sm bg-[#FAF7F2]">
              {/* Photo selector */}
              <div>
                <label className="block font-bold text-[#1E120D] mb-1.5">
                  Foto Menu
                </label>
                <div className="flex gap-3 items-center">
                  <div className="w-20 h-20 rounded-2xl bg-white border border-[#E5DDD5] shrink-0 overflow-hidden flex items-center justify-center">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-[#BAA688]" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      placeholder="URL Gambar (https://...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[#E5DDD5] bg-white rounded-xl focus:outline-none focus:border-[#4A2C1D]"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#F2ECE4] text-[#1E120D] text-xs font-semibold cursor-pointer border border-[#E5DDD5]">
                      <Upload className="w-3.5 h-3.5 text-[#4A2C1D]" />
                      <span>Pilih dari Perangkat</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Presets */}
                <div className="mt-2.5">
                  <span className="text-[11px] text-[#7A685D] font-bold block mb-1">
                    Pilihan Cepat Menu Warkop:
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto p-1.5 bg-white rounded-2xl border border-[#E5DDD5]">
                    {WARKOP_IMAGE_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            image: p.url,
                            category: p.cat,
                            name: prev.name || p.label,
                          }));
                        }}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                          formData.image === p.url
                            ? 'bg-[#3D2417] text-white'
                            : 'bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E120D] border border-[#E5DDD5]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Description */}
              <div>
                <label className="block font-bold text-[#1E120D] mb-1">Nama Menu *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kopi Tubruk Robusta"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D] font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#1E120D] mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  placeholder="Contoh: Kopi robusta khas Lampung pekat dan wangi"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E120D] mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D]"
                  >
                    {categories.filter((c) => c !== 'Semua').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#1E120D] mb-1">Satuan</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#1E120D] mb-1">Harga Jual (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="1000"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D] font-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#1E120D] mb-1">Harga Modal (Rp)</label>
                  <input
                    type="number"
                    value={formData.cost || ''}
                    onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl border border-[#E5DDD5] bg-white text-[#1E120D] font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-[#3D2417] hover:bg-[#2C1A10] text-white font-bold"
                >
                  Simpan Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock Modal */}
      {restockProductTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E120D]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#E5DDD5]">
            <h3 className="font-extrabold text-base text-[#1E120D] mb-1">
              Tambah Stok: {restockProductTarget.name}
            </h3>
            <p className="text-xs text-[#7A685D] mb-4">
              Stok saat ini: <strong>{restockProductTarget.stock} {restockProductTarget.unit}</strong>
            </p>

            <form onSubmit={handleRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E120D] mb-1">
                  Jumlah Tambahan
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border-2 border-[#4A2C1D] rounded-xl text-lg font-black text-[#1E120D] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[10, 25, 50].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRestockQty(num)}
                    className="py-1.5 bg-[#FAF7F2] hover:bg-[#EFE9DF] text-[#1E120D] font-bold rounded-xl text-xs border border-[#E5DDD5]"
                  >
                    +{num}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRestockProductTarget(null)}
                  className="flex-1 py-2 rounded-xl border border-[#E5DDD5] text-[#1E120D] font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#3D2417] text-white font-bold"
                >
                  Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E120D]/80 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#E5DDD5] text-center">
            <h3 className="font-extrabold text-base text-[#1E120D]">Hapus Menu Ini?</h3>
            <p className="text-xs text-[#7A685D] mt-1 mb-4">
              Menu akan dihapus dari etalase kasir dan sistem warkop.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl border border-[#E5DDD5] text-[#1E120D] font-bold"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  await onDeleteProduct(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
