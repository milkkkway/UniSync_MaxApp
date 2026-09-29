import React from 'react';
import { useApp } from '../../context/AppContext';
import { FolderGit2, Plus, Star, ExternalLink, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';
import { maxBridge } from '../../services/maxBridge';

interface ScreenStudentPortfolioProps {
  onAddManualProject: () => void;
  onOpenChatForDealId: (dealId: string) => void;
}

export const ScreenStudentPortfolio: React.FC<ScreenStudentPortfolioProps> = ({
  onAddManualProject,
  onOpenChatForDealId,
}) => {
  const { projects, currentUser, deals } = useApp();

  const studentProjects = projects.filter((p) => p.studentId === currentUser?.id);
  const totalEarned = studentProjects.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col px-3.5 pt-3 pb-28 overflow-y-auto space-y-3.5">
      <div className="bg-[#141517] text-white rounded-3xl p-4 shadow-xl border border-white/5 relative overflow-hidden shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Заработано через МАХ Кейсы
            </span>
            <div className="text-[28px] font-black text-white tracking-tight leading-tight mt-0.5">
              {totalEarned.toLocaleString('ru-RU')} ₽
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#BAEA55] text-black flex items-center justify-center font-black shadow-md">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
          <div>
            <span className="text-[10.5px] text-slate-400 block">Сдано проектов</span>
            <span className="font-extrabold text-[#BAEA55] text-base">{studentProjects.length}</span>
          </div>
          <div>
            <span className="text-[10.5px] text-slate-400 block">Статус исполнителя</span>
            <span className="font-extrabold text-emerald-400 text-xs flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Верифицирован</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-sm text-[#121316]">Выполненные кейсы ({studentProjects.length})</h3>
        <button
          type="button"
          onClick={() => {
            maxBridge.haptic('light');
            onAddManualProject();
          }}
          className="flex items-center gap-1.5 bg-[#BAEA55] hover:bg-[#c2f35d] text-black text-xs font-extrabold px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Добавить работу</span>
        </button>
      </div>

      <div className="space-y-3">
        {studentProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200">
            <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-bold">В портфолио пока нет завершенных проектов.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Завершите сделку через чат бота или добавьте внешнюю работу вручную.
            </p>
          </div>
        ) : (
          studentProjects.map((p) => {
            const relatedDeal = deals.find((d) => d.vacancyId === p.vacancyId && d.studentId === p.studentId);
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {p.completedDate} • {p.isManual ? 'Внешний проект' : 'Биржа МАХ'}
                    </span>
                    <h4 className="font-extrabold text-[14px] text-[#121316] mt-0.5 leading-snug">
                      {p.title}
                    </h4>
                    <span className="text-[11.5px] font-bold text-slate-600">Заказчик: {p.clientName}</span>
                  </div>

                  <span className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl shrink-0">
                    {p.amount.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <p className="text-[11.5px] text-slate-600 leading-relaxed">{p.description}</p>

                {p.reviewText && (
                  <div className="p-2.5 rounded-2xl bg-[#EEF6E1] border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1 text-emerald-800 font-bold mb-1 text-[11px]">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>Отзыв работодателя ({p.rating || 5}/5):</span>
                    </div>
                    <p className="text-[11px] text-slate-700 italic">«{p.reviewText}»</p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  {p.externalUrl ? (
                    <a
                      href={p.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-bold text-[11px] flex items-center gap-1 hover:underline"
                    >
                      <span>Смотреть результат</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[10.5px] text-slate-400">Результат сдан заказчику</span>
                  )}

                  {relatedDeal && (
                    <button
                      type="button"
                      onClick={() => onOpenChatForDealId(relatedDeal.id)}
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-black py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Архив чата</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
