import React from 'react';
import { Vacancy } from '../../types';
import { Sparkles, Calendar, Building2, ArrowUpRight } from 'lucide-react';
import { maxBridge } from '../../services/maxBridge';

interface SteppedVacancyCardProps {
  vacancy: Vacancy;
  onApply?: (vacancy: Vacancy) => void;
  onViewDetails?: (vacancy: Vacancy) => void;
  buttonLabel?: string;
  hasApplied?: boolean;
}

export const SteppedVacancyCard: React.FC<SteppedVacancyCardProps> = ({
  vacancy,
  onApply,
  onViewDetails,
  buttonLabel = 'Откликнуться',
  hasApplied = false,
}) => {
  return (
    <div className="relative w-full h-[175px] select-none group transition-transform hover:scale-[1.01]">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          maxBridge.haptic('medium');
          if (onApply) {
            onApply(vacancy);
          } else if (onViewDetails) {
            onViewDetails(vacancy);
          }
        }}
        className={`absolute right-3.5 top-[5px] z-20 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap ${
          hasApplied
            ? 'bg-emerald-400 hover:bg-emerald-500 text-black font-black'
            : 'bg-[#BAEA55] hover:bg-[#c4f35e] text-black font-extrabold'
        }`}
      >
        <span className="w-3.5 h-3.5 rounded-full bg-black text-[#BAEA55] flex items-center justify-center text-[10px] font-black leading-none shrink-0">
          {hasApplied ? '✓' : '+'}
        </span>
        <span className="text-[11px] font-extrabold tracking-tight whitespace-nowrap">
          {hasApplied ? 'Отозвать' : buttonLabel}
        </span>
      </button>

      <svg
        className="absolute inset-0 w-full h-full filter drop-shadow-md"
        viewBox="0 0 335 175"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M 26 0 
             L 160 0 
             C 172 0, 178 9, 181 19 
             C 184 29, 190 38, 202 38 
             L 309 38 
             A 26 26 0 0 1 335 64 
             L 335 149 
             A 26 26 0 0 1 309 175 
             L 26 175 
             A 26 26 0 0 1 0 149 
             L 0 26 
             A 26 26 0 0 1 26 0 
             Z"
          fill="#131416"
        />
      </svg>

      <div
        onClick={() => onViewDetails?.(vacancy)}
        className="relative z-10 w-full h-full p-3.5 flex flex-col justify-between text-white cursor-pointer"
      >
        <div>
          <div className="flex items-center justify-between gap-[15px]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-extrabold text-[12px] tracking-wider text-[#BAEA55] uppercase flex items-center gap-1 whitespace-nowrap shrink-0">
                <Sparkles className="w-3.5 h-3.5" />
                <span>МАХ КЕЙС</span>
              </span>
            </div>
          </div>

          <div className="mt-1">
            <span className="text-[10px] font-medium text-slate-400 block">Вознаграждение за проект</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[25px] font-black text-white tracking-tight leading-tight block">
                {vacancy.budget.toLocaleString('ru-RU')} ₽
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-semibold">
                {vacancy.format}
              </span>
            </div>

            <p className="text-[12px] font-bold text-slate-100 line-clamp-1 mt-1 pr-14">
              {vacancy.title}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10.5px] text-slate-300 font-medium pb-0.5 pr-14">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{vacancy.companyName}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>до {new Date(vacancy.deadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</span>
          </div>
        </div>

        <div className="absolute right-3.5 bottom-3.5 w-10 h-16 bg-[#BAEA55] rounded-full flex flex-col items-center justify-center shadow-md">
          <span className="text-[9px] font-black text-black leading-none uppercase">МАХ</span>
          <ArrowUpRight className="w-5 h-5 text-black mt-0.5" />
        </div>
      </div>
    </div>
  );
};
