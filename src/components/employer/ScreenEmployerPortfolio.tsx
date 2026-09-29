import React from 'react';
import { useApp } from '../../context/AppContext';
import { FolderGit2, Star, MessageSquare, CheckCircle, TrendingUp } from 'lucide-react';

interface ScreenEmployerPortfolioProps {
  onOpenChatForDealId: (dealId: string) => void;
}

export const ScreenEmployerPortfolio: React.FC<ScreenEmployerPortfolioProps> = ({
  onOpenChatForDealId,
}) => {
  const { projects, deals, currentUser } = useApp();

  const employerProjects = projects.filter((p) => p.employerId === currentUser?.id);
  const totalPaid = employerProjects.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col px-3.5 pt-3 pb-28 overflow-y-auto space-y-3.5">
      <div className="bg-[#141517] text-white rounded-3xl p-4 shadow-xl border border-white/5 relative overflow-hidden flex items-center justify-between shrink-0">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Выплачено студентам за кейсы
          </span>
          <div className="text-[28px] font-black text-white tracking-tight leading-tight mt-0.5">
            {totalPaid.toLocaleString('ru-RU')} ₽
          </div>
          <span className="text-[11px] text-[#BAEA55] mt-1 block">
            Успешно закрыто задач: {employerProjects.length}
          </span>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[#BAEA55] text-black flex items-center justify-center font-black shadow-md">
          <FolderGit2 className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-[#121316] px-1">
          Завершенные и оплаченные проекты ({employerProjects.length})
        </h3>

        {employerProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Пока нет завершенных кейсов.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              После завершения сделки и подтверждения выплаты проект появится здесь.
            </p>
          </div>
        ) : (
          employerProjects.map((p) => {
            const relatedDeal = deals.find((d) => d.vacancyId === p.vacancyId && d.employerId === currentUser?.id);
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {p.completedDate} • Сделка завершена
                    </span>
                    <h4 className="font-extrabold text-[14px] text-[#121316] mt-0.5 leading-snug">
                      {p.title}
                    </h4>
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
                      <span>Ваш отзыв о работе ({p.rating || 5}/5):</span>
                    </div>
                    <p className="text-[11px] text-slate-700 italic">«{p.reviewText}»</p>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Выплата по СБП подтверждена</span>
                  </span>

                  {relatedDeal && (
                    <button
                      type="button"
                      onClick={() => onOpenChatForDealId(relatedDeal.id)}
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-black py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-all"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Чат проекта</span>
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
