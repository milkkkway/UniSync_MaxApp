import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vacancy } from '../../types';
import { SteppedVacancyCard } from '../common/SteppedVacancyCard';
import { maxBridge } from '../../services/maxBridge';
import { ArrowLeft, Building2, Calendar, MapPin, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';

interface VacancyDetailsModalProps {
  vacancy: Vacancy;
  onClose: () => void;
  onOpenChat: (dealId: string) => void;
}

export const VacancyDetailsModal: React.FC<VacancyDetailsModalProps> = ({
  vacancy,
  onClose,
  onOpenChat,
}) => {
  const { applications, currentUser, toggleApplication, deals } = useApp();

  const isApplied = applications.some(
    (a) => a.vacancyId === vacancy.id && a.studentId === currentUser?.id
  );

  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const relatedDeal = deals.find(
    (d) => d.vacancyId === vacancy.id && d.studentId === currentUser?.id
  );

  const handleToggle = () => {
    maxBridge.haptic('medium');
    const res = toggleApplication(vacancy.id);
    if (res.status === 'applied') {
      setNotificationMsg('✓ Вы успешно откликнулись на кейс!');
    } else {
      setNotificationMsg('Отклик отозван');
    }
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#EEF6E1] text-[#121316] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 select-none">
      <div className="bg-white/80 backdrop-blur-md px-4 py-2.5 border-b border-black/5 flex items-center justify-between shadow-2xs shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="font-extrabold text-[13.5px] text-[#121316]">Предпросмотр кейса</span>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-bold text-slate-500 hover:text-black px-2 py-1"
        >
          Закрыть
        </button>
      </div>

      <div className="flex-1 p-3.5 pb-24 overflow-y-auto space-y-3.5">
        {notificationMsg && (
          <div className="p-3 rounded-2xl bg-[#141517] text-[#BAEA55] text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        <div>
          <SteppedVacancyCard
            vacancy={vacancy}
            buttonLabel={isApplied ? 'Откликнуться' : 'Откликнуться'}
            hasApplied={isApplied}
            onApply={handleToggle}
          />
        </div>

        <div className="text-[10.5px] text-center text-slate-600 bg-white/70 p-2 rounded-2xl border border-slate-200">
          {isApplied ? (
            <span className="text-emerald-800 font-bold">
              ✓ Вы откликнулись на кейс. Нажмите на кнопку на карте еще раз, чтобы отозвать отклик.
            </span>
          ) : (
            <span>
              Нажмите кнопку <strong className="text-black">+ Откликнуться</strong> в углу карты, чтобы отправить заявку. Повторное нажатие отменит отклик.
            </span>
          )}
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-2.5">
          <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
            Техническое задание и требования
          </h4>
          <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-medium">
            {vacancy.description}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-2">
          <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider">
            Требуемый стек технологий
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {vacancy.requiredSkills.map((s, idx) => (
              <span
                key={idx}
                className="bg-[#141517] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#BAEA55] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-[#121316]">{vacancy.companyName}</div>
              <div className="text-[11px] text-slate-500 font-medium">
                {vacancy.city} • Формат: {vacancy.format}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-bold">Дедлайн:</span>
            <span className="text-[11px] font-extrabold text-slate-800">
              {new Date(vacancy.deadline).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>

        {isApplied && relatedDeal && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onOpenChat(relatedDeal.id)}
              className="w-full flex items-center justify-center gap-2 bg-[#141517] hover:bg-black text-[#BAEA55] font-extrabold py-3 px-4 rounded-2xl shadow-lg transition-all active:scale-95 text-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Перейти в чат по этому кейсу →</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
