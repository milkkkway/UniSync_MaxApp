import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { maxBridge } from '../../services/maxBridge';
import {
  GraduationCap,
  MapPin,
  Briefcase,
  Star,
  Eye,
  KeyRound,
  Plus,
  Trash2,
  ExternalLink,
  Award,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { CaseLink, Certificate } from '../../types';

interface ScreenStudentProfileProps {
  onOpenPreview: (studentId: string) => void;
  onOpenChangePass: () => void;
}

export const ScreenStudentProfile: React.FC<ScreenStudentProfileProps> = ({
  onOpenPreview,
  onOpenChangePass,
}) => {
  const { currentUser, studentProfile, updateStudentProfile } = useApp();

  const [fullName, setFullName] = useState(studentProfile?.fullName || currentUser?.name || '');
  const [age, setAge] = useState<number>(studentProfile?.age || 20);
  const [university, setUniversity] = useState(studentProfile?.university || '');
  const [city, setCity] = useState(studentProfile?.city || 'Москва');
  const [sphere, setSphere] = useState(studentProfile?.sphere || 'IT & Веб-разработка');
  const [experience, setExperience] = useState(studentProfile?.experience || '');
  const [about, setAbout] = useState(studentProfile?.about || '');

  const [softSkills, setSoftSkills] = useState<string[]>(studentProfile?.softSkills || []);
  const [hardSkills, setHardSkills] = useState<string[]>(studentProfile?.hardSkills || []);
  const [newSoft, setNewSoft] = useState('');
  const [newHard, setNewHard] = useState('');

  const [caseLinks, setCaseLinks] = useState<CaseLink[]>(studentProfile?.caseLinks || []);
  const [certificates, setCertificates] = useState<Certificate[]>(studentProfile?.certificates || []);

  const [isAddingLink, setIsAddingLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPlatform, setLinkPlatform] = useState<CaseLink['platform']>('github');

  const [isAddingCert, setIsAddingCert] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certYear, setCertYear] = useState('2026');

  const [savedSuccess, setSavedSuccess] = useState(false);

  let completeness = 30;
  if (university) completeness += 15;
  if (about) completeness += 15;
  if (hardSkills.length > 0) completeness += 15;
  if (softSkills.length > 0) completeness += 10;
  if (caseLinks.length > 0) completeness += 15;
  completeness = Math.min(100, completeness);

  const handleAddSoft = () => {
    if (!newSoft.trim()) return;
    setSoftSkills([...softSkills, newSoft.trim()]);
    setNewSoft('');
    maxBridge.haptic('light');
  };

  const handleRemoveSoft = (index: number) => {
    setSoftSkills(softSkills.filter((_, i) => i !== index));
    maxBridge.haptic('light');
  };

  const handleAddHard = () => {
    if (!newHard.trim()) return;
    setHardSkills([...hardSkills, newHard.trim()]);
    setNewHard('');
    maxBridge.haptic('light');
  };

  const handleRemoveHard = (index: number) => {
    setHardSkills(hardSkills.filter((_, i) => i !== index));
    maxBridge.haptic('light');
  };

  const handleAddLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) return;
    const newL: CaseLink = {
      id: `link-${Date.now()}`,
      title: linkTitle,
      url: linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`,
      platform: linkPlatform,
    };
    setCaseLinks([...caseLinks, newL]);
    setLinkTitle('');
    setLinkUrl('');
    setIsAddingLink(false);
    maxBridge.haptic('light');
  };

  const handleRemoveLink = (id: string) => {
    setCaseLinks(caseLinks.filter((l) => l.id !== id));
    maxBridge.haptic('light');
  };

  const handleAddCert = () => {
    if (!certTitle.trim() || !certIssuer.trim()) return;
    const newC: Certificate = {
      id: `cert-${Date.now()}`,
      title: certTitle,
      issuer: certIssuer,
      year: certYear,
    };
    setCertificates([...certificates, newC]);
    setCertTitle('');
    setCertIssuer('');
    setIsAddingCert(false);
    maxBridge.haptic('light');
  };

  const handleRemoveCert = (id: string) => {
    setCertificates(certificates.filter((c) => c.id !== id));
    maxBridge.haptic('light');
  };

  const handleSave = () => {
    updateStudentProfile({
      fullName,
      age: Number(age) || 20,
      university,
      city,
      sphere,
      experience,
      about,
      softSkills,
      hardSkills,
      caseLinks,
      certificates,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col px-3.5 pt-3 pb-28 overflow-y-auto space-y-3.5">
      <div className="bg-[#141517] text-white rounded-3xl p-4 shadow-xl border border-white/10 relative overflow-hidden shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#BAEA55] to-emerald-400 p-[2px] shadow-sm flex items-center justify-center overflow-hidden shrink-0 text-black font-black text-lg">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={fullName || 'Студент'}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              (fullName || currentUser?.name || 'С').charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-[15px] text-white truncate leading-tight">
              {fullName || currentUser?.name || 'Студент'}
            </h2>
            <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
              {university || 'ВУЗ не заполнен'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#BAEA55]">
            <Star className="w-3.5 h-3.5 fill-[#BAEA55]" />
            <span>{studentProfile?.rating?.toFixed(1) || '5.0'}</span>
            <span className="text-[10px] text-slate-400 font-medium">
              • {studentProfile?.completedProjectsCount || 0} кейсов
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => currentUser && onOpenPreview(currentUser.id)}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-[#BAEA55] text-[10.5px] font-bold px-2.5 py-1 rounded-full transition-all active:scale-95 cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              <span>Превью</span>
            </button>
            <button
              type="button"
              onClick={onOpenChangePass}
              className="flex items-center gap-1 bg-white/5 hover:bg-white/15 text-slate-300 text-[10px] font-semibold px-2 py-1 rounded-full transition-all active:scale-95"
            >
              <KeyRound className="w-3 h-3" />
              <span>Пароль</span>
            </button>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400 font-medium">Заполненность анкеты для компаний</span>
            <span className="font-extrabold text-[#BAEA55]">{completeness}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-[#BAEA55] rounded-full transition-all duration-300"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">Анкета успешно сохранена в базу данных!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-3.5">
        <h3 className="font-extrabold text-sm text-[#121316]">Личные данные</h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Возраст</label>
            <input
              type="number"
              min={14}
              max={100}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black font-semibold"
            />
          </div>
          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Город</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black font-semibold"
            >
              <option value="Москва">Москва</option>
              <option value="Санкт-Петербург">Санкт-Петербург</option>
              <option value="Казань">Казань</option>
              <option value="Новосибирск">Новосибирск</option>
              <option value="Екатеринбург">Екатеринбург</option>
              <option value="Нижний Новгород">Нижний Новгород</option>
              <option value="Удаленно (РФ)">Удаленно (РФ)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-slate-700 block mb-1">ВУЗ, факультет и курс</label>
          <input
            type="text"
            placeholder="МГТУ им. Баумана, ИУ-7, 3 курс"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black"
          />
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Основная специализация</label>
          <select
            value={sphere}
            onChange={(e) => setSphere(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black font-semibold"
          >
            <option value="IT & Веб-разработка">IT & Веб-разработка</option>
            <option value="Дизайн и UI/UX">Дизайн и UI/UX</option>
            <option value="Анализ данных & Python">Анализ данных & Python</option>
            <option value="Маркетинг & SMM">Маркетинг & SMM</option>
            <option value="Копирайтинг & Переводы">Копирайтинг & Переводы</option>
            <option value="Мобильная разработка">Мобильная разработка</option>
          </select>
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Опыт и навыки кратко</label>
          <input
            type="text"
            placeholder="2 года разработки на React & Mini Apps"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black"
          />
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-slate-700 block mb-1">О себе (самопрезентация для компаний)</label>
          <textarea
            rows={3}
            placeholder="Расскажите о себе, своих сильных сторонах и готовности к задачам..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black resize-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-2.5">
        <h3 className="font-extrabold text-sm text-[#121316]">Hard Skills (Технологии & Инструменты)</h3>
        <div className="flex flex-wrap gap-1.5">
          {hardSkills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-[#141517] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-2xs"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveHard(idx)}
                className="text-slate-400 hover:text-rose-400 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Добавить навык (напр. React, Python)"
            value={newHard}
            onChange={(e) => setNewHard(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHard())}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={handleAddHard}
            className="bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-extrabold p-2 rounded-xl text-xs active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-2.5">
        <h3 className="font-extrabold text-sm text-[#121316]">Soft Skills (Гибкие навыки)</h3>
        <div className="flex flex-wrap gap-1.5">
          {softSkills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 bg-[#EEF6E1] text-emerald-900 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-2xs"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveSoft(idx)}
                className="text-emerald-700 hover:text-rose-600 font-bold"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            placeholder="Добавить (напр. Дедлайны, ТЗ)"
            value={newSoft}
            onChange={(e) => setNewSoft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSoft())}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden"
          />
          <button
            type="button"
            onClick={handleAddSoft}
            className="bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-extrabold p-2 rounded-xl text-xs active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#121316]">Ссылки на кейсы и репозитории</h3>
          <button
            type="button"
            onClick={() => setIsAddingLink(true)}
            className="text-[11px] font-bold text-emerald-700 hover:text-black flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить</span>
          </button>
        </div>

        <div className="space-y-2">
          {caseLinks.length === 0 ? (
            <p className="text-xs text-slate-400 py-1">Ссылки на GitHub или портфолио пока не добавлены.</p>
          ) : (
            caseLinks.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-6 h-6 rounded-lg bg-[#141517] text-white flex items-center justify-center font-bold text-[10px] shrink-0 uppercase">
                    {l.platform === 'github' ? 'GH' : l.platform === 'behance' ? 'BE' : 'WEB'}
                  </span>
                  <div className="truncate">
                    <div className="font-bold text-[#121316] truncate">{l.title}</div>
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-blue-600 truncate hover:underline flex items-center gap-1"
                    >
                      <span className="truncate">{l.url}</span>
                      <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveLink(l.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {isAddingLink && (
          <div className="p-3 rounded-2xl bg-slate-100 border border-slate-300 space-y-2 text-xs animate-in fade-in">
            <div className="font-bold text-slate-800">Новая ссылка на кейс</div>
            <input
              type="text"
              placeholder="Название (напр. GitHub: Mini App Cart)"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5"
            />
            <input
              type="text"
              placeholder="URL (https://github.com/...)"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5"
            />
            <div className="flex gap-2">
              <select
                value={linkPlatform}
                onChange={(e) => setLinkPlatform(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs"
              >
                <option value="github">GitHub</option>
                <option value="behance">Behance</option>
                <option value="website">Сайт / Демо</option>
                <option value="kaggle">Kaggle</option>
              </select>
              <button
                type="button"
                onClick={handleAddLink}
                className="bg-[#BAEA55] text-black font-extrabold px-3 py-1 rounded-xl text-xs"
              >
                Сохранить ссылку
              </button>
              <button
                type="button"
                onClick={() => setIsAddingLink(false)}
                className="text-slate-500 hover:text-black px-2 py-1"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#121316]">Сертификаты и курсы</h3>
          <button
            type="button"
            onClick={() => setIsAddingCert(true)}
            className="text-[11px] font-bold text-emerald-700 hover:text-black flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Добавить</span>
          </button>
        </div>

        <div className="space-y-2">
          {certificates.length === 0 ? (
            <p className="text-xs text-slate-400 py-1">Сертификаты пока не прикреплены.</p>
          ) : (
            certificates.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <div className="font-bold text-[#121316]">{c.title}</div>
                    <div className="text-[10px] text-slate-500">
                      {c.issuer} • {c.year}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCert(c.id)}
                  className="text-slate-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {isAddingCert && (
          <div className="p-3 rounded-2xl bg-slate-100 border border-slate-300 space-y-2 text-xs animate-in fade-in">
            <div className="font-bold text-slate-800">Новый сертификат</div>
            <input
              type="text"
              placeholder="Название (напр. VK Mini Apps Architect)"
              value={certTitle}
              onChange={(e) => setCertTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5"
            />
            <input
              type="text"
              placeholder="Кем выдан (напр. VK Education / Бауманка)"
              value={certIssuer}
              onChange={(e) => setCertIssuer(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Год"
                value={certYear}
                onChange={(e) => setCertYear(e.target.value)}
                className="w-20 bg-white border border-slate-200 rounded-xl px-2 py-1"
              />
              <button
                type="button"
                onClick={handleAddCert}
                className="bg-[#BAEA55] text-black font-extrabold px-3 py-1 rounded-xl text-xs"
              >
                Добавить
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCert(false)}
                className="text-slate-500 hover:text-black px-2 py-1"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-[#141517] hover:bg-black text-[#BAEA55] font-black py-3.5 px-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Сохранить анкету в базу</span>
        </button>
      </div>
    </div>
  );
};
