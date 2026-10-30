import React, { useState } from 'react';
import { X, Lock, ShieldCheck, User, KeyRound } from 'lucide-react';
import { UserAccount } from '../types';

interface RoleLoginModalProps {
  isOpen: boolean;
  currentUser: UserAccount;
  allUsers: UserAccount[];
  onClose: () => void;
  onSelectUser: (user: UserAccount) => void;
}

export const RoleLoginModal: React.FC<RoleLoginModalProps> = ({
  isOpen,
  currentUser,
  allUsers,
  onClose,
  onSelectUser,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserAccount>(currentUser);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  if (!isOpen) return null;

  const handleUserSelect = (user: UserAccount) => {
    setSelectedUser(user);
    setEnteredPin('');
    setPinError('');
  };

  const handleLoginConfirm = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (enteredPin && enteredPin !== selectedUser.pin) {
      setPinError(`PIN salah! (PIN ${selectedUser.name}: ${selectedUser.role === 'admin' ? '1234' : '0000'})`);
      return;
    }
    onSelectUser(selectedUser);
    onClose();
  };

  const handleQuickSwitch = (user: UserAccount) => {
    onSelectUser(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E120D]/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-[#E5DDD5]">
        <div className="bg-[#1E120D] text-white p-4 px-5 flex items-center justify-between border-b border-[#2C1A12]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#D4A373]" />
            <h3 className="font-extrabold text-sm sm:text-base text-white">Ganti Akun Kasir / Admin</h3>
          </div>
          <button onClick={onClose} className="text-[#C5B3A1] hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 bg-[#FAF7F2]">
          <p className="text-xs text-[#7A685D]">
            Pilih pengguna kasir Warkop Kita untuk pergantian shift kerja.
          </p>

          <div className="space-y-2">
            {allUsers.map((user) => {
              const isSelected = selectedUser.id === user.id;
              const isCurrent = currentUser.id === user.id;
              return (
                <div
                  key={user.id}
                  onClick={() => handleUserSelect(user)}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#3D2417] bg-white ring-2 ring-[#4A2C1D]/20 shadow-xs'
                      : 'border-[#E5DDD5] bg-[#FAF7F2] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#261811] text-[#E2C39B] flex items-center justify-center font-bold text-xs shrink-0">
                      {user.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#1E120D] text-xs sm:text-sm">
                          {user.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-[#EFE9DF] text-[#3D2417] px-1.5 py-0.2 rounded font-semibold">
                            Aktif
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#7A685D] block font-semibold">
                        {user.role === 'admin' ? 'Akses Penuh (Admin)' : 'Kasir Shift'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickSwitch(user);
                    }}
                    className="text-xs font-bold text-[#3D2417] bg-[#EFE9DF] hover:bg-[#D9CEBA] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Masuk
                  </button>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleLoginConfirm} className="pt-2 border-t border-[#E5DDD5] space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#1E120D] mb-1">
                PIN Akses (PIN {selectedUser.name}: {selectedUser.role === 'admin' ? '1234' : '0000'})
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A685D]" />
                <input
                  type="password"
                  maxLength={6}
                  placeholder={`PIN ${selectedUser.name}`}
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError('');
                  }}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#E5DDD5] rounded-xl focus:outline-none focus:border-[#4A2C1D] font-mono tracking-widest"
                />
              </div>
              {pinError && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{pinError}</p>}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 rounded-xl border border-[#E5DDD5] bg-white text-[#1E120D] text-xs font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-[#3D2417] text-white text-xs font-bold cursor-pointer"
              >
                Konfirmasi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
