import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Star, GraduationCap, MapPin, ExternalLink, Award, CheckCircle2, MessageSquare } from 'lucide-react';
import { maxBridge } from '../../services/maxBridge';

interface StudentProfilePreviewModalProps {
  studentId: string;
  onClose: () => void;
  onStartChat?: () => void;
}

export const StudentProfilePreviewModal: React.FC<StudentProfilePreviewModalProps> = ({
  studentId,
  onClose,
  onStartChat,
}) => {
  const { currentRole } = useApp();

  const saved = localStorage.getItem('max_student_profiles');
  const profiles = saved ? JSON.parse(saved) : {};
  const profile = profiles[studentId];

  if (!profile) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 select-none">
      <div className="bg-white text-[#121316] rounded-3xl max-w-md w-full max-h-[92%] flex flex-col shadow-2xl border-2 border-black/80 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 bg-[#141517] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#BAEA55] uppercase tracking-wider">
              {currentRole === 'employer' ? 'Анкета кандидата' : 'Превью: Как видит работодатель'}
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

        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#BAEA55] p-[2px] flex items-center justify-center font-black text-black text-xl shadow-xs">
              {profile.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#121316]">{profile.fullName}</h3>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile.university}</span>
              </p>
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className="flex items-center gap-0.5 font-black text-[#BAEA55] bg-[#141517] px-2 py-0.2 rounded-full">
                  <Star className="w-3 h-3 fill-[#BAEA55]" />
                  <span>{profile.rating.toFixed(1)}</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {profile.city} • {profile.age} лет
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">Сдано проектов</span>
              <span className="font-black text-slate-900 text-sm">{profile.completedProjectsCount} кейсов</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">Специализация</span>
              <span className="font-bold text-slate-900 text-xs truncate block">{profile.sphere}</span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              О себе
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
              {profile.about || 'Информация не указана.'}
            </p>
          </div>

          {profile.hardSkills?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Ключевой стек технологий
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.hardSkills.map((s: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-[#141517] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.softSkills?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Гибкие навыки
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.softSkills.map((s: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-[#EEF6E1] text-emerald-900 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.caseLinks?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Примеры работ & Репозитории
              </h4>
              <div className="space-y-1.5">
                {profile.caseLinks.map((l: any) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs transition-colors group"
                  >
                    <span className="font-bold text-slate-800 group-hover:text-blue-600 truncate">
                      {l.title}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {profile.certificates?.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Сертификаты
              </h4>
              <div className="space-y-1.5">
                {profile.certificates.map((c: any) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">{c.title}</div>
                      <div className="text-[10px] text-slate-500">{c.issuer} ({c.year})</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-black"
          >
            Закрыть
          </button>
          {onStartChat && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onStartChat();
              }}
              className="flex items-center gap-1.5 bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-extrabold px-4 py-2 rounded-xl text-xs shadow-md active:scale-95 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Написать в чат</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
