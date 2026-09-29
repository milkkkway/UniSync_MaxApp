import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { maxBridge } from '../../services/maxBridge';
import { Building2, Globe, FileText, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export const ScreenEmployerCompany: React.FC = () => {
  const { employerProfile, updateEmployerProfile, currentUser } = useApp();

  const [companyName, setCompanyName] = useState(employerProfile?.companyName || currentUser?.name || '');
  const [contactPerson, setContactPerson] = useState(employerProfile?.contactPerson || '');
  const [sphere, setSphere] = useState(employerProfile?.sphere || 'IT & Digital разработка');
  const [city, setCity] = useState(employerProfile?.city || 'Москва');
  const [inn, setInn] = useState(employerProfile?.inn || '');
  const [website, setWebsite] = useState(employerProfile?.website || '');
  const [description, setDescription] = useState(employerProfile?.description || '');
  const [logoUrl, setLogoUrl] = useState(employerProfile?.logoUrl || '');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateEmployerProfile({
      companyName,
      contactPerson,
      sphere,
      city,
      inn,
      website,
      description,
      logoUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col px-3.5 pt-3 pb-28 overflow-y-auto space-y-3.5">
      <div className="bg-[#141517] text-white rounded-3xl p-4 shadow-xl border border-white/5 relative overflow-hidden shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 p-[2px] shadow-sm flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
            {logoUrl ? (
              <img src={logoUrl} alt={companyName} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <Building2 className="w-6 h-6 text-[#BAEA55]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-base text-white">{companyName}</h2>
              <ShieldCheck className="w-4 h-4 text-[#BAEA55]" />
            </div>
            <p className="text-[11px] text-slate-300 font-medium truncate max-w-[200px]">
              {sphere} • {city}
            </p>
            {inn && (
              <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                ИНН: {inn}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-slate-400">Рейтинг работодателя:</span>
          <span className="font-extrabold text-[#BAEA55]">★ {employerProfile?.rating.toFixed(1) || '5.0'}</span>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">Профиль компании успешно сохранен!</span>
        </div>
      )}

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-3.5">
        <h3 className="font-extrabold text-sm text-[#121316]">Данные организации</h3>

        <div>
          <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
            Название компании / студии / ИП *
          </label>
          <input
            type="text"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black font-semibold"
          />
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
            Контактное лицо (менеджер / тимлид)
          </label>
          <input
            type="text"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Сфера деятельности</label>
            <select
              value={sphere}
              onChange={(e) => setSphere(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black font-semibold"
            >
              <option value="IT & Digital разработка">IT & Digital</option>
              <option value="E-commerce & Ритейл">E-commerce & Ритейл</option>
              <option value="Финтех & Банкинг">Финтех & Банкинг</option>
              <option value="Маркетинг & PR">Маркетинг & PR</option>
              <option value="Медиа & Производство">Медиа</option>
            </select>
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Город</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black font-semibold"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">ИНН компании</label>
            <input
              type="text"
              maxLength={12}
              value={inn}
              onChange={(e) => setInn(e.target.value.replace(/\D/g, ''))}
              placeholder="10 или 12 цифр"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black font-mono"
            />
          </div>

          <div>
            <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Официальный сайт</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://company.ru"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-slate-700 block mb-1">Ссылка на логотип (URL)</label>
          <input
            type="url"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-black"
          />
        </div>

        <div>
          <label className="text-[10.5px] font-bold text-slate-700 block mb-1">
            О компании и задачах для студентов
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Расскажите о проектах компании, технологическом стеке и что вы предлагаете молодым специалистам..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black resize-none leading-relaxed"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="w-full bg-[#141517] hover:bg-black text-[#BAEA55] font-black py-3.5 px-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>Сохранить профиль компании</span>
      </button>
    </div>
  );
};
