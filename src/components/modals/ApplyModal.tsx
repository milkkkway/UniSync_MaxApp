import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vacancy } from '../../types';
import { X, Send, AlertCircle, Sparkles, Building2 } from 'lucide-react';
import { maxBridge } from '../../services/maxBridge';

interface ApplyModalProps {
  vacancy: Vacancy;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplyModal: React.FC<ApplyModalProps> = ({ vacancy, onClose, onSuccess }) => {
  const { applyToVacancy } = useApp();

  const [coverLetter, setCoverLetter] = useState(
    'Здравствуйте! Ознакомился с ТЗ кейса. Имею опыт работы с указанным стеком и готов выполнить задачу с соблюдением дедлайна и рекомендаций MAX SDK.'
  );
  const [proposedPrice, setProposedPrice] = useState<number>(vacancy.budget);
  const [deliveryDays, setDeliveryDays] = useState<number>(7);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!coverLetter.trim()) {
      setErrorMsg('Пожалуйста, напишите краткое сопроводительное письмо.');
      return;
    }
    if (proposedPrice <= 0) {
      setErrorMsg('Укажите корректную стоимость работы.');
      return;
    }

    const res = applyToVacancy(vacancy.id, coverLetter.trim(), proposedPrice, deliveryDays);
    if (!res.success) {
      setErrorMsg(res.message || 'Ошибка отправки отклика');
      maxBridge.hapticNotification('error');
    } else {
      onSuccess();
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none">
      <div className="bg-white text-[#121316] rounded-3xl max-w-md w-full shadow-2xl border-2 border-black/80 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 bg-[#141517] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#BAEA55] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Отклик на кейс</span>
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

        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <div className="text-[11px] text-slate-500 font-semibold">{vacancy.companyName}</div>
          <h3 className="font-extrabold text-sm text-[#121316] mt-0.5">{vacancy.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
              Бюджет компании: {vacancy.budget.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-[10.5px] text-slate-500 font-medium">Формат: {vacancy.format}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Сопроводительное письмо для компании *
            </label>
            <textarea
              rows={4}
              required
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Расскажите, почему ваш опыт подходит для этого кейса..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                Ваша цена за работу (₽)
              </label>
              <input
                type="number"
                min={1000}
                step={500}
                value={proposedPrice}
                onChange={(e) => setProposedPrice(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                Срок выполнения (дней)
              </label>
              <input
                type="number"
                min={1}
                max={90}
                value={deliveryDays}
                onChange={(e) => setDeliveryDays(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          <p className="text-[10.5px] text-slate-400">
            После отправки отклика автоматически откроется чат с заказчиком для обсуждения деталей.
          </p>

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
              className="flex items-center gap-1.5 bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-extrabold px-4 py-2 rounded-xl text-xs shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Отправить отклик</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
