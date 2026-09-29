import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, MessageSquare, CornerDownRight, Check, Send } from 'lucide-react';
import { maxBridge } from '../../services/maxBridge';

export const ScreenStudentReviews: React.FC = () => {
  const { reviews, currentUser, replyToReview, studentProfile } = useApp();

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const studentReviews = reviews.filter((r) => r.targetId === currentUser?.id);
  const avgRating = studentProfile?.rating || 5.0;

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText.trim());
    setActiveReplyId(null);
    setReplyText('');
    maxBridge.hapticNotification('success');
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col px-3.5 pt-3 pb-28 overflow-y-auto space-y-3.5">
      <div className="bg-[#141517] text-white rounded-3xl p-4 shadow-xl border border-white/5 relative overflow-hidden flex items-center justify-between shrink-0">
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Средняя оценка исполнителя
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-[32px] font-black text-white leading-none">
              {avgRating.toFixed(1)}
            </span>
            <div className="flex items-center text-[#BAEA55]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#BAEA55]" />
              ))}
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            На основе {studentReviews.length} отзывов от компаний
          </span>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-[#BAEA55] text-black flex items-center justify-center font-black shadow-md">
          <Star className="w-6 h-6 fill-black" />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-[#121316] px-1">
          Отзывы работодателей ({studentReviews.length})
        </h3>

        {studentReviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200">
            <p className="text-xs text-slate-500 font-medium">Отзывов пока нет. Выполните первый кейс на бирже!</p>
          </div>
        ) : (
          studentReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200 space-y-2.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-[#121316]">{rev.authorName}</h4>
                  <span className="text-[10px] text-slate-400 block">
                    Кейс: «{rev.projectName}» • {rev.date}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-[#EEF6E1] px-2 py-0.5 rounded-full border border-emerald-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black text-emerald-950">{rev.rating}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed italic">«{rev.text}»</p>

              {rev.replyText ? (
                <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs ml-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10.5px]">
                    <CornerDownRight className="w-3 h-3 text-emerald-600" />
                    <span>Ваш ответ:</span>
                  </div>
                  <p className="text-[11.5px] text-slate-800">{rev.replyText}</p>
                </div>
              ) : activeReplyId === rev.id ? (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <textarea
                    rows={2}
                    placeholder="Напишите вежливый ответ работодателю..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:outline-hidden focus:border-black resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveReplyId(null)}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-black font-semibold"
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendReply(rev.id)}
                      className="flex items-center gap-1 bg-[#BAEA55] text-black font-extrabold px-3 py-1 rounded-xl text-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Отправить ответ</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveReplyId(rev.id);
                      setReplyText('');
                    }}
                    className="text-[11px] font-bold text-slate-600 hover:text-black flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Ответить на отзыв</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
