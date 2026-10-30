import React, { useState } from 'react';
import { X, Coffee, Check, RefreshCw } from 'lucide-react';
import { StoreSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  settings: StoreSettings;
  onClose: () => void;
  onSaveSettings: (settings: StoreSettings) => Promise<void>;
  onResetDemo: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onClose,
  onSaveSettings,
  onResetDemo,
}) => {
  const [formData, setFormData] = useState<StoreSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E120D]/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E5DDD5]">
        <div className="bg-[#1E120D] text-white p-4 px-5 flex items-center justify-between border-b border-[#2C1A12]">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-[#D4A373]" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">Pengaturan Warkop Kita</h3>
          </div>
          <button onClick={onClose} className="text-[#C5B3A1] hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs sm:text-sm bg-[#FAF7F2]">
          <div>
            <label className="block font-bold text-[#1E120D] mb-1">Nama Warkop</label>
            <input
              type="text"
              required
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D] font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E120D] mb-1">Slogan / Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-[#1E120D] mb-1">No. Telepon / WA</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#1E120D] mb-1">Tarif Pajak (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.taxRatePercent}
                onChange={(e) => setFormData({ ...formData, taxRatePercent: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#1E120D] mb-1">Alamat Warkop</label>
            <textarea
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#1E120D] mb-1">Catatan Kaki Struk</label>
            <textarea
              rows={2}
              value={formData.receiptFooterMessage}
              onChange={(e) => setFormData({ ...formData, receiptFooterMessage: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D]"
            />
          </div>

          {/* Tax toggle */}
          <div className="p-3 bg-white rounded-2xl border border-[#E5DDD5] flex items-center justify-between">
            <div>
              <span className="font-bold text-[#1E120D] block">Terapkan Pajak {formData.taxRatePercent}%</span>
              <span className="text-[11px] text-[#7A685D]">
                Menghitung pajak otomatis pada pesanan keranjang
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.enableTax}
              onChange={(e) => setFormData({ ...formData, enableTax: e.target.checked })}
              className="w-5 h-5 text-[#3D2417] accent-[#3D2417] rounded cursor-pointer"
            />
          </div>

          <div className="pt-2 border-t border-[#E5DDD5] flex items-center justify-between">
            <button
              type="button"
              onClick={onResetDemo}
              className="text-xs text-[#C84B31] hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Data Demo Warkop</span>
            </button>

            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Tersimpan!
              </span>
            )}
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-[#E5DDD5] bg-white text-[#1E120D] font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl bg-[#3D2417] hover:bg-[#2C1A10] text-white font-bold"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
