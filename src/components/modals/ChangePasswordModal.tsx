import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, KeyRound, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ChangePasswordModalProps {
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose }) => {
  const { changePassword } = useApp();

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (newPass !== confirmPass) {
      setErrorMsg('Новые пароли не совпадают.');
      return;
    }
    const res = changePassword(oldPass, newPass);
    if (!res.success) {
      setErrorMsg(res.message || 'Ошибка смены пароля');
    } else {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none">
      <div className="bg-white text-[#121316] rounded-3xl max-w-sm w-full shadow-2xl border-2 border-black/80 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 bg-[#141517] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#BAEA55]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Смена пароля
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Пароль успешно обновлен!</span>
            </div>
          )}

          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Текущий пароль</label>
            <input
              type="password"
              required
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Новый пароль (от 6 знаков)</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Повторите новый пароль</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-black"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="bg-[#BAEA55] text-black font-extrabold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
            >
              Обновить пароль
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
