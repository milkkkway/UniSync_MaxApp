import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Sparkles, Building2, Calendar } from 'lucide-react';
import { WorkFormat } from '../../types';

interface CreateTaskModalProps {
  onClose: () => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ onClose }) => {
  const { createVacancy, employerProfile } = useApp();

  const [title, setTitle] = useState('');
  const [sphere, setSphere] = useState('IT & Веб-разработка');
  const [city, setCity] = useState(employerProfile?.city || 'Москва');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(30000);
  const [format, setFormat] = useState<WorkFormat>('Удаленно');
  const [deadline, setDeadline] = useState('2026-10-30');
  const [skillsText, setSkillsText] = useState('React, TypeScript, MAX SDK');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const requiredSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createVacancy({
      title: title.trim(),
      sphere,
      city,
      description: description.trim(),
      budget: Number(budget) || 20000,
      format,
      deadline,
      requiredSkills: requiredSkills.length > 0 ? requiredSkills : ['Понимание ТЗ'],
      status: 'active',
    });

    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none">
      <div className="bg-white text-[#121316] rounded-3xl max-w-md w-full max-h-[94%] flex flex-col shadow-2xl border-2 border-black/80 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 bg-[#141517] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#BAEA55] uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Публикация кейса на бирже МАХ</span>
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

        <form onSubmit={handleSubmit} className="flex-1 p-5 overflow-y-auto space-y-3 text-xs">
          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
              Название задачи / кейса *
            </label>
            <input
              type="text"
              required
              placeholder="Напр. Разработка витрины товаров в Mini App МАХ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:border-black"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Сфера деятельности</label>
              <select
                value={sphere}
                onChange={(e) => setSphere(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
              >
                <option value="IT & Веб-разработка">IT & Веб-разработка</option>
                <option value="Дизайн и UI/UX">Дизайн и UI/UX</option>
                <option value="Анализ данных & Python">Анализ данных & Python</option>
                <option value="Маркетинг & SMM">Маркетинг & SMM</option>
                <option value="Копирайтинг & Переводы">Копирайтинг & Переводы</option>
              </select>
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Формат работы</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as WorkFormat)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold"
              >
                <option value="Удаленно">Удаленно</option>
                <option value="Офис">Офис</option>
                <option value="Гибрид">Гибрид</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                Бюджет вознаграждения (₽) *
              </label>
              <input
                type="number"
                min={1000}
                step={1000}
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
                Крайний срок (Дедлайн) *
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
              Требуемый стек / навыки (через запятую)
            </label>
            <input
              type="text"
              placeholder="React, TypeScript, Tailwind, MAX SDK"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
              Техническое задание и требования к результату *
            </label>
            <textarea
              rows={4}
              required
              placeholder="Подробно опишите задачу, входные данные, критерии приемки и стек..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black resize-none leading-relaxed"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 shrink-0">
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
              <Plus className="w-3.5 h-3.5" />
              <span>Опубликовать задачу</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
