import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { maxBridge } from '../../services/maxBridge';
import {
  X,
  Send,
  CreditCard,
  CheckCircle2,
  Star,
  Building2,
  GraduationCap,
  Copy,
  Check,
  Shield,
  Handshake,
  Paperclip,
  ExternalLink,
} from 'lucide-react';

interface ChatModalProps {
  dealId: string;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ dealId, onClose }) => {
  const {
    deals,
    messages,
    currentUser,
    sendMessage,
    agreeDeal,
    sendRequisites,
    confirmPayment,
    leaveReview,
  } = useApp();

  const deal = deals.find((d) => d.id === dealId);
  const chatMessages = messages.filter((m) => m.chatId === dealId);

  const [inputVal, setInputVal] = useState('');
  const [showRequisitesModal, setShowRequisitesModal] = useState(false);
  const [bankName, setBankName] = useState('Т-Банк (СБП)');
  const [recipientPhone, setRecipientPhone] = useState('+7 (999) 000-00-00');
  const [cardNumber, setCardNumber] = useState('');
  const [requisitesNote, setRequisitesNote] = useState('Перевод по СБП за проект');

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const [copiedReq, setCopiedReq] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  if (!deal) return null;

  const isStudent = currentUser?.role === 'student';
  const partnerName = isStudent ? deal.employerName : deal.studentName;

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputVal.trim()) return;
    sendMessage(dealId, inputVal.trim(), 'text');
    setInputVal('');
  };

  const handleAgree = () => {
    maxBridge.haptic('medium');
    agreeDeal(dealId);
  };

  const handleSendRequisitesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendRequisites(dealId, {
      bankName,
      recipientPhone,
      cardNumber: cardNumber.trim() || undefined,
      note: requisitesNote.trim() || undefined,
    });
    setShowRequisitesModal(false);
  };

  const handleConfirmPayment = () => {
    maxBridge.haptic('medium');
    confirmPayment(dealId);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    leaveReview(dealId, reviewRating, reviewText.trim());
    setShowReviewModal(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedReq(true);
    setTimeout(() => setCopiedReq(false), 2000);
    maxBridge.haptic('light');
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#EEF6E1] text-[#121316] flex flex-col overflow-hidden select-none animate-in fade-in">
      <div className="w-full h-full flex flex-col relative overflow-hidden">
        <div className="bg-white px-4 py-3 border-b border-black/5 flex items-center justify-between shadow-2xs shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#141517] text-[#BAEA55] font-black flex items-center justify-center shadow-xs">
              {isStudent ? <Building2 className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-[14px] text-[#121316] leading-tight truncate max-w-[190px]">
                  {partnerName}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[10.5px] text-slate-500 font-medium truncate max-w-[210px]">
                {deal.vacancyTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-black text-black bg-[#BAEA55] px-2.5 py-1 rounded-full shadow-2xs">
              {deal.agreedAmount.toLocaleString('ru-RU')} ₽
            </span>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-[#141517] text-white px-4 py-2.5 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-1.5 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#BAEA55]" />
              <span>Статус сделки:</span>
            </span>
            <span className="font-extrabold text-[#BAEA55] uppercase text-[10px] tracking-wider">
              {deal.stage === 'negotiation' && 'Обсуждение условий'}
              {deal.stage === 'in_progress' && 'В работе'}
              {deal.stage === 'waiting_payment' && 'Ожидает оплаты по СБП'}
              {deal.stage === 'completed' && 'Завершен и оплачен'}
            </span>
          </div>

          {deal.stage === 'negotiation' && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <span className="text-[10px] text-slate-300">Согласны с ценой и сроками выполнения?</span>
              <button
                type="button"
                onClick={handleAgree}
                className="flex items-center gap-1.5 bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-black text-xs px-3 py-1.5 rounded-full shadow-md active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Договорились</span>
              </button>
            </div>
          )}

          {deal.stage === 'in_progress' && isStudent && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <span className="text-[10.5px] text-slate-300">Работа готова или согласована?</span>
              <button
                type="button"
                onClick={() => setShowRequisitesModal(true)}
                className="flex items-center gap-1.5 bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-black text-xs px-3 py-1.5 rounded-full shadow-md active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Отправить реквизиты</span>
              </button>
            </div>
          )}

          {deal.stage === 'in_progress' && !isStudent && (
            <div className="text-[10.5px] text-slate-300 pt-1 border-t border-white/10 flex items-center justify-between">
              <span>Студент выполняет задачу. Ожидайте готовности и реквизитов.</span>
            </div>
          )}

          {deal.stage === 'waiting_payment' && !isStudent && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <div>
                <span className="text-[10px] text-slate-300 block">Студент предоставил реквизиты:</span>
                <span className="font-mono text-xs font-bold text-[#BAEA55]">
                  {deal.requisites?.bankName} ({deal.requisites?.recipientPhone})
                </span>
              </div>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="flex items-center gap-1.5 bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-black text-xs px-3 py-1.5 rounded-full shadow-md active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Подтвердить оплату</span>
              </button>
            </div>
          )}

          {deal.stage === 'waiting_payment' && isStudent && (
            <div className="text-[10.5px] text-[#BAEA55] pt-1 border-t border-white/10 flex items-center justify-between font-medium">
              <span>Реквизиты сохранены. Ожидайте подтверждения оплаты от работодателя.</span>
            </div>
          )}

          {deal.stage === 'completed' && (
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Проект сдан и закрыт</span>
              </span>

              {((isStudent && !deal.studentReviewLeft) || (!isStudent && !deal.employerReviewLeft)) && (
                <button
                  type="button"
                  onClick={() => setShowReviewModal(true)}
                  className="flex items-center gap-1 bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-black text-xs px-3 py-1 rounded-full shadow-xs active:scale-95 transition-all"
                >
                  <Star className="w-3 h-3 fill-black" />
                  <span>Оставить отзыв</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {chatMessages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            const isSystem = msg.type === 'system';
            const isRequisites = msg.type === 'requisites';

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div className="bg-white/80 backdrop-blur-xs text-[#141517] text-[11px] px-3.5 py-1.5 rounded-2xl border border-black/5 shadow-2xs max-w-[85%] text-center font-medium leading-relaxed">
                    {msg.text}
                  </div>
                </div>
              );
            }

            if (isRequisites) {
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className="bg-[#141517] text-white p-3.5 rounded-3xl border border-[#BAEA55]/40 shadow-lg max-w-[85%] space-y-2">
                    <div className="flex items-center gap-1.5 text-[#BAEA55] font-black text-xs">
                      <CreditCard className="w-4 h-4" />
                      <span>Реквизиты для выплаты по СБП</span>
                    </div>
                    <div className="text-xs space-y-1 font-mono bg-white/5 p-2 rounded-xl text-slate-200">
                      <div>Банк: <span className="text-white font-bold">{msg.metadata?.bankName}</span></div>
                      <div>Телефон: <span className="text-[#BAEA55] font-bold">{msg.metadata?.recipientPhone}</span></div>
                      {msg.metadata?.cardNumber && (
                        <div>Карта: <span className="text-white font-bold">{msg.metadata.cardNumber}</span></div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(msg.metadata?.recipientPhone || '')}
                        className="text-[#BAEA55] hover:underline flex items-center gap-1 font-bold"
                      >
                        {copiedReq ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedReq ? 'Скопировано!' : 'Скопировать номер СБП'}</span>
                      </button>
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] rounded-3xl px-4 py-2.5 text-xs shadow-2xs ${
                    isMe
                      ? 'bg-[#141517] text-white rounded-br-xs'
                      : 'bg-white text-[#121316] rounded-bl-xs border border-slate-200'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className={`text-[9.5px] mt-1 text-right ${isMe ? 'text-slate-400' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSend}
          className="p-3 bg-white border-t border-black/5 flex items-center gap-2 shrink-0"
        >
          <button
            type="button"
            onClick={() => {
              const link = prompt('Вставьте ссылку на репозиторий, макет Figma или файл:');
              if (link) {
                sendMessage(dealId, `📎 Ссылка на материалы проекта: ${link}`, 'link', { linkUrl: link });
              }
            }}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-black transition-colors"
            title="Прикрепить ссылку / файл"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            placeholder="Напишите сообщение в МАХ..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black font-medium"
          />

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-black font-bold shadow-md transition-all active:scale-95 cursor-pointer ${
              inputVal.trim() ? 'bg-[#BAEA55] hover:bg-[#c2f35d]' : 'bg-slate-200 text-slate-400'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {showRequisitesModal && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-extrabold text-sm text-[#121316]">Реквизиты для оплаты по СБП</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRequisitesModal(false)}
                  className="text-slate-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-500">
                Укажите банк и номер телефона, привязанный к Системе быстрых платежей (СБП).
              </p>

              <form onSubmit={handleSendRequisitesSubmit} className="space-y-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Банк получателя</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
                  >
                    <option value="Т-Банк (Тинькофф)">Т-Банк (Тинькофф)</option>
                    <option value="Сбербанк">Сбербанк</option>
                    <option value="Альфа-Банк">Альфа-Банк</option>
                    <option value="ВТБ">ВТБ</option>
                    <option value="Яндекс Банк">Яндекс Банк</option>
                    <option value="Озон Банк">Озон Банк</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    Номер телефона для СБП *
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">
                    Номер карты (опционально)
                  </label>
                  <input
                    type="text"
                    placeholder="2200 •••• •••• ••••"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRequisitesModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 font-semibold"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="bg-[#BAEA55] text-black font-extrabold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all"
                  >
                    Отправить в чат
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showReviewModal && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full shadow-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-sm text-[#121316]">Отзыв о сотрудничестве</h4>
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="text-slate-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <form onSubmit={handleReviewSubmit} className="space-y-2.5">
                <textarea
                  rows={3}
                  required
                  placeholder="Опишите ваши впечатления от совместной работы..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-hidden focus:border-black resize-none"
                />

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 font-semibold"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="bg-[#BAEA55] text-black font-extrabold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all"
                  >
                    Опубликовать отзыв
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
