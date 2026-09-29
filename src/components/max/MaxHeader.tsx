import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { maxBridge } from '../../services/maxBridge';
import { MoreVertical, LogOut, ArrowLeft } from 'lucide-react';

interface MaxHeaderProps {
  onBack?: () => void;
  showBack?: boolean;
}

export const MaxHeader: React.FC<MaxHeaderProps> = ({ onBack, showBack = false }) => {
  const { currentUser, currentRole, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative w-full z-40 bg-white/70 backdrop-blur-md border-b border-black/5 px-4 py-2 flex items-center justify-between shadow-2xs">
      <div className="flex items-center gap-2.5">
        {showBack && onBack ? (
          <button
            type="button"
            onClick={() => {
              maxBridge.haptic('light');
              onBack();
            }}
            className="w-8 h-8 rounded-full bg-white shadow-xs border border-black/5 flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Назад"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#141517] to-[#25282d] p-[2px] shadow-xs flex items-center justify-center text-[#BAEA55] font-black text-sm">
            U
          </div>
        )}

        <div className="flex items-center">
          <span className="font-extrabold text-[16px] tracking-tight bg-gradient-to-r from-[#121316] via-[#2c3d14] to-[#71a017] bg-clip-text text-transparent">
            UniSync
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              maxBridge.haptic('light');
              setMenuOpen(!menuOpen);
            }}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-black/5 shadow-2xs flex items-center justify-center text-slate-800 transition-all active:scale-95"
            aria-label="Меню"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-10 w-52 bg-[#141517] text-white rounded-2xl shadow-2xl border border-white/10 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-[11px] text-slate-400">
                {currentUser ? (
                  <div>
                    <div className="font-bold text-white truncate">{currentUser.name}</div>
                    <div className="text-[10px] text-[#BAEA55]">
                      {currentRole === 'student' ? 'Студент / Исполнитель' : 'Работодатель / Заказчик'}
                    </div>
                  </div>
                ) : (
                  'Не авторизован'
                )}
              </div>

              {currentUser && (
                <div className="mt-1 border-t border-white/10 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Выйти из аккаунта</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

  );
};
