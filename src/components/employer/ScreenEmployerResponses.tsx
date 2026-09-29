import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { maxBridge } from '../../services/maxBridge';
import { Star, MessageSquare, Eye, XCircle, CheckCircle2, UserCheck, GraduationCap } from 'lucide-react';
import { Application } from '../../types';

interface ScreenEmployerResponsesProps {
  initialVacancyId?: string | null;
  onPreviewStudent: (studentId: string) => void;
  onOpenChat: (app: Application) => void;
}

export const ScreenEmployerResponses: React.FC<ScreenEmployerResponsesProps> = ({
  initialVacancyId = null,
  onPreviewStudent,
  onOpenChat,
}) => {
  const { applications, vacancies, currentUser } = useApp();

  const [selectedVacId, setSelectedVacId] = useState<string>(initialVacancyId || 'all');
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Выбран другой кандидат');

  const myVacancies = vacancies.filter((v) => v.employerId === currentUser?.id);
  const myVacIds = new Set(myVacancies.map((v) => v.id));

  const relevantApplications = applications.filter((a) => {
    if (!myVacIds.has(a.vacancyId)) return false;
    if (selectedVacId !== 'all' && a.vacancyId !== selectedVacId) return false;
    return true;
  });

  const handleReject = (appId: string) => {

    const app = applications.find((a) => a.id === appId);
    if (app) {
      app.status = 'rejected';
      app.rejectReason = rejectReason;
    }
    setRejectingAppId(null);
    maxBridge.hapticNotification('warning');
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col px-3.5 pt-3 pb-28 overflow-y-auto space-y-3.5">
      <div className="bg-white rounded-3xl p-3.5 shadow-xs border border-slate-200">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
          Фильтр по кейсам:
        </label>
        <select
          value={selectedVacId}
          onChange={(e) => {
            setSelectedVacId(e.target.value);
            maxBridge.haptic('light');
          }}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden font-semibold"
        >
          <option value="all">Все задачи ({myVacancies.length})</option>
          {myVacancies.map((v) => (
            <option key={v.id} value={v.id}>
              {v.title} ({v.responsesCount} откликов)
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between px-1">
        <h3 className="font-extrabold text-sm text-[#121316]">
          Кандидаты на рассмотрении ({relevantApplications.length})
        </h3>
      </div>

      <div className="space-y-3">
        {relevantApplications.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-600 font-bold">Откликов пока нет.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Студенты увидят ваши опубликованные задачи в общем каталоге.
            </p>
          </div>
        ) : (
          relevantApplications.map((app) => {
            const vac = vacancies.find((v) => v.id === app.vacancyId);
            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#BAEA55] to-emerald-400 p-[2px] flex items-center justify-center font-bold text-black text-sm shadow-2xs">
                      {app.studentName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-sm text-[#121316]">{app.studentName}</h4>
                        <span className="flex items-center gap-0.5 text-[11px] font-black text-amber-500 bg-amber-50 px-1.5 py-0.2 rounded-full border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{app.studentRating.toFixed(1)}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <GraduationCap className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[170px]">{app.studentUniversity}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-slate-900 block">
                      {app.proposedPrice.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-[10px] text-slate-400">Срок: {app.deliveryDays} дн.</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium">
                  Кейс: <span className="font-bold text-slate-700">{vac?.title}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed italic">
                  «{app.coverLetter}»
                </div>

                {rejectingAppId === app.id ? (
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 text-xs animate-in fade-in">
                    <span className="font-bold text-rose-800 block">Причина отклонения:</span>
                    <select
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="w-full bg-white border border-rose-200 rounded-xl p-2 text-xs font-semibold"
                    >
                      <option value="Выбран другой кандидат">Выбран другой кандидат</option>
                      <option value="Не подошел стек технологий">Не подошел стек технологий</option>
                      <option value="Высокая предложенная цена">Высокая предложенная цена</option>
                      <option value="Большой срок выполнения">Большой срок выполнения</option>
                    </select>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setRejectingAppId(null)}
                        className="px-2.5 py-1 text-slate-600 hover:text-black font-semibold"
                      >
                        Отмена
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(app.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1 rounded-xl text-xs"
                      >
                        Подтвердить отказ
                      </button>
                    </div>
                  </div>
                ) : (

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => onPreviewStudent(app.studentId)}
                      className="flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-black bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-full transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Анкета</span>
                    </button>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          maxBridge.haptic('light');
                          setRejectingAppId(app.id);
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-white bg-rose-500 hover:bg-rose-600 px-3 py-1.5 rounded-full transition-all active:scale-95 whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
                      >
                        <XCircle className="w-3.5 h-3.5 text-white" />
                        <span>Отклонить</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          maxBridge.haptic('medium');
                          onOpenChat(app);
                        }}
                        className="flex items-center gap-1 bg-[#BAEA55] hover:bg-[#c2f35d] text-black text-[11px] font-black px-3 py-1.5 rounded-full shadow-xs active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Чат</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
