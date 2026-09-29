import React from 'react';
import { useApp } from '../../context/AppContext';
import { SteppedVacancyCard } from '../common/SteppedVacancyCard';
import { Plus, Users, Pause, Play, Copy, Trash2, Calendar, Building, Sparkles } from 'lucide-react';
import { maxBridge } from '../../services/maxBridge';
import { Vacancy } from '../../types';

interface ScreenEmployerTasksProps {
  onOpenCreateTask: () => void;
  onOpenResponsesForTask: (vacancyId: string) => void;
}

export const ScreenEmployerTasks: React.FC<ScreenEmployerTasksProps> = ({
  onOpenCreateTask,
  onOpenResponsesForTask,
}) => {
  const { vacancies, currentUser, updateVacancyStatus, duplicateVacancy, deleteVacancy } = useApp();

  const myTasks = vacancies.filter((v) => v.employerId === currentUser?.id);
  const activeTasks = myTasks.filter((v) => v.status === 'active');

  const topTask = myTasks[0];

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col px-3.5 pt-3 pb-28 overflow-y-auto space-y-3.5">
      <div className="bg-[#141517] text-white rounded-3xl p-4 shadow-xl border border-white/5 relative overflow-hidden flex flex-col justify-between shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#BAEA55] uppercase tracking-wider block">
              Управление задачами
            </span>
            <h2 className="text-base font-black text-white mt-0.5">Опубликовать кейс</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-[210px] leading-snug">
              Привлекайте талантливых студентов ВУЗов на проектные задачи
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              maxBridge.haptic('medium');
              onOpenCreateTask();
            }}
            className="w-12 h-12 rounded-2xl bg-[#BAEA55] hover:bg-[#c2f35d] text-black flex items-center justify-center font-black shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
            title="Новая задача"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Опубликовано кейсов</span>
            <span className="font-extrabold text-[#BAEA55] text-base">{myTasks.length}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Активных на бирже</span>
            <span className="font-extrabold text-white text-base">{activeTasks.length}</span>
          </div>
        </div>
      </div>

      {topTask && (
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5 px-1">
            Ваша приоритетная задача в каталоге
          </span>
          <SteppedVacancyCard
            vacancy={topTask}
            buttonLabel="Смотреть отклики"
            onApply={() => onOpenResponsesForTask(topTask.id)}
            onViewDetails={() => onOpenResponsesForTask(topTask.id)}
          />
        </div>
      )}

      <div className="flex items-center justify-between px-1 pt-1">
        <h3 className="font-extrabold text-sm text-[#121316]">Все ваши кейсы ({myTasks.length})</h3>
        <button
          type="button"
          onClick={() => {
            maxBridge.haptic('light');
            onOpenCreateTask();
          }}
          className="text-xs font-bold text-emerald-800 hover:text-black flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Новая задача</span>
        </button>
      </div>

      <div className="space-y-3">
        {myTasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-6 text-center border border-slate-200">
            <p className="text-xs text-slate-600 font-bold">Вы пока не опубликовали ни одного кейса.</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Нажмите кнопку выше, чтобы разместить задачу для студентов.
            </p>
          </div>
        ) : (
          myTasks.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full ${
                        t.status === 'active'
                          ? 'bg-[#EEF6E1] text-emerald-900 border border-emerald-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t.status === 'active' ? '● Активна на бирже' : '⏸ На паузе'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{t.format}</span>
                  </div>

                  <h4 className="font-extrabold text-[14px] text-[#121316] leading-snug">{t.title}</h4>
                </div>

                <span className="text-sm font-black text-slate-900 bg-slate-100 px-2.5 py-1 rounded-xl shrink-0">
                  {t.budget.toLocaleString('ru-RU')} ₽
                </span>
              </div>

              <p className="text-[11.5px] text-slate-600 line-clamp-2 leading-relaxed">{t.description}</p>

              <div className="flex flex-wrap gap-1">
                {t.requiredSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onOpenResponsesForTask(t.id)}
                  className="flex items-center gap-1.5 font-bold text-slate-900 bg-[#EEF6E1] hover:bg-[#BAEA55] text-[11px] px-2.5 py-1 rounded-full border border-emerald-200 transition-all active:scale-95"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Откликов: {t.responsesCount}</span>
                </button>

                <div className="flex items-center gap-1 text-slate-500">
                  <button
                    type="button"
                    onClick={() => updateVacancyStatus(t.id, t.status === 'active' ? 'paused' : 'active')}
                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-black transition-colors"
                    title={t.status === 'active' ? 'Приостановить' : 'Возобновить'}
                  >
                    {t.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => duplicateVacancy(t.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-black transition-colors"
                    title="Дублировать задачу"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
                        deleteVacancy(t.id);
                      }
                    }}
                    className="p-1.5 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
