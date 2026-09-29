import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, FolderGit2 } from 'lucide-react';

interface AddProjectModalProps {
  onClose: () => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose }) => {
  const { addManualProject } = useApp();

  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [amount, setAmount] = useState<number>(20000);
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    addManualProject({
      title: title.trim(),
      clientName: clientName.trim(),
      amount: Number(amount) || 10000,
      completedDate: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: description.trim() || 'Проект выполнен вне биржи МАХ.',
      externalUrl: externalUrl.trim() || undefined,
      rating: 5,
    });

    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none">
      <div className="bg-white text-[#121316] rounded-3xl max-w-md w-full shadow-2xl border-2 border-black/80 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 bg-[#141517] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#BAEA55]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Добавить работу в портфолио
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

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Название проекта *</label>
            <input
              type="text"
              required
              placeholder="Напр. Бот для записи в салон красоты в МАХ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Заказчик / Клиент *</label>
              <input
                type="text"
                required
                placeholder="Студия Красоты / Пет-проект"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden font-semibold"
              />
            </div>
            <div>
              <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Бюджет кейса (₽)</label>
              <input
                type="number"
                min={0}
                step={500}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Ссылка на результат (URL)</label>
            <input
              type="url"
              placeholder="https://github.com/... или ссылка на демо"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Краткое описание работы</label>
            <textarea
              rows={3}
              placeholder="Что было сделано, стек, какие задачи решены..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-hidden resize-none leading-relaxed"
            />
          </div>

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
              className="bg-[#BAEA55] text-black font-extrabold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
            >
              Сохранить проект
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
