import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SteppedVacancyCard } from '../common/SteppedVacancyCard';
import { Vacancy } from '../../types';
import { maxBridge } from '../../services/maxBridge';
import { Search, X, SlidersHorizontal, Building2, Calendar, MapPin, CheckCircle2, MessageSquare, ArrowRight } from 'lucide-react';

interface ScreenStudentVacanciesProps {
  onSelectVacancy: (vacancy: Vacancy) => void;
  onApplyVacancy: (vacancy: Vacancy) => void;
  onOpenChatForDealId: (dealId: string) => void;
}

export const ScreenStudentVacancies: React.FC<ScreenStudentVacanciesProps> = ({
  onSelectVacancy,
  onApplyVacancy,
  onOpenChatForDealId,
}) => {
  const { vacancies, applications, currentUser, deals } = useApp();

  const [subTab, setSubTab] = useState<'catalog' | 'my_applications'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSphere, setSelectedSphere] = useState<string>('Все');
  const [selectedFormat, setSelectedFormat] = useState<string>('Все');
  const [sortBy, setSortBy] = useState<'newest' | 'price_desc' | 'price_asc'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');

  const myAppliedIds = useMemo(() => {
    return new Set(applications.filter((a) => a.studentId === currentUser?.id).map((a) => a.vacancyId));
  }, [applications, currentUser]);

  const featuredVacancy = useMemo(() => {
    return vacancies.find((v) => v.status === 'active') || vacancies[0];
  }, [vacancies]);

  const filteredVacancies = useMemo(() => {
    return vacancies
      .filter((v) => {
        if (v.status !== 'active' && subTab === 'catalog') return false;
        if (selectedSphere !== 'Все' && v.sphere !== selectedSphere) return false;
        if (selectedFormat !== 'Все' && v.format !== selectedFormat) return false;
        if (minPrice && v.budget < Number(minPrice)) return false;
        if (maxPrice && v.budget > Number(maxPrice)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = v.title.toLowerCase().includes(q);
          const matchDesc = v.description.toLowerCase().includes(q);
          const matchSkills = v.requiredSkills.some((s) => s.toLowerCase().includes(q));
          const matchComp = v.companyName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSkills && !matchComp) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_desc') return b.budget - a.budget;
        if (sortBy === 'price_asc') return a.budget - b.budget;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [vacancies, subTab, selectedSphere, selectedFormat, minPrice, maxPrice, searchQuery, sortBy]);

  const myApplicationsList = useMemo(() => {
    return applications
      .filter((a) => a.studentId === currentUser?.id)
      .map((app) => {
        const vac = vacancies.find((v) => v.id === app.vacancyId);
        const deal = deals.find((d) => d.vacancyId === app.vacancyId && d.studentId === app.studentId);
        return { app, vac, deal };
      });
  }, [applications, currentUser, vacancies, deals]);

  return (
    <div className="flex-1 min-h-0 w-full flex flex-col px-3.5 pt-3 pb-28 overflow-y-auto space-y-3.5">
      <div className="bg-[#141517] p-1 rounded-2xl flex items-center shadow-md shrink-0">
        <button
          type="button"
          onClick={() => {
            maxBridge.haptic('light');
            setSubTab('catalog');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            subTab === 'catalog' ? 'bg-[#BAEA55] text-black shadow-xs' : 'text-slate-300 hover:text-white'
          }`}
        >
          Каталог кейсов ({vacancies.filter((v) => v.status === 'active').length})
        </button>
        <button
          type="button"
          onClick={() => {
            maxBridge.haptic('light');
            setSubTab('my_applications');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all relative ${
            subTab === 'my_applications' ? 'bg-[#BAEA55] text-black shadow-xs' : 'text-slate-300 hover:text-white'
          }`}
        >
          Мои отклики ({myApplicationsList.length})
        </button>
      </div>

      {subTab === 'catalog' ? (
        <>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Поиск по названию или стеку (React, Python...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-9 pr-8 py-2.5 text-xs text-slate-900 shadow-2xs focus:outline-hidden focus:border-black"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                maxBridge.haptic('light');
                setShowFilters(!showFilters);
              }}
              className={`p-2.5 rounded-2xl border transition-all active:scale-95 shadow-2xs ${
                showFilters || selectedSphere !== 'Все' || selectedFormat !== 'Все' || minPrice
                  ? 'bg-[#141517] text-[#BAEA55] border-[#141517]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Фильтры"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          {showFilters && (
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 space-y-3 animate-in fade-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Параметры поиска кейсов</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSphere('Все');
                    setSelectedFormat('Все');
                    setMinPrice('');
                    setMaxPrice('');
                  }}
                  className="text-[11px] text-rose-500 hover:underline"
                >
                  Сбросить
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Сфера</label>
                  <select
                    value={selectedSphere}
                    onChange={(e) => setSelectedSphere(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  >
                    <option value="Все">Все сферы</option>
                    <option value="IT & Веб-разработка">IT & Веб-разработка</option>
                    <option value="Дизайн и UI/UX">Дизайн и UI/UX</option>
                    <option value="Анализ данных & Python">Анализ данных</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Формат работы</label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  >
                    <option value="Все">Любой формат</option>
                    <option value="Удаленно">Удаленно</option>
                    <option value="Офис">Офис</option>
                    <option value="Гибрид">Гибрид</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Бюджет от (₽)</label>
                  <input
                    type="number"
                    placeholder="10 000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Сортировка</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs"
                  >
                    <option value="newest">Сначала новые</option>
                    <option value="price_desc">Сначала дороже</option>
                    <option value="price_asc">Сначала дешевле</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700">
                Все доступные вакансии ({filteredVacancies.length})
              </span>
            </div>

            {filteredVacancies.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center border border-slate-200">
                <p className="text-xs text-slate-700 font-bold">На бирже пока нет опубликованных кейсов.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Зарегистрируйтесь как работодатель или создайте первую задачу для проверки откликов!
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSphere('Все');
                    }}
                    className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
                  >
                    Очистить фильтры
                  </button>
                )}
              </div>
            ) : (
              filteredVacancies.map((vac) => {
                const hasApplied = myAppliedIds.has(vac.id);
                return (
                  <div
                    key={vac.id}
                    onClick={() => onSelectVacancy(vac)}
                    className="bg-white hover:bg-slate-50/80 rounded-3xl p-4 shadow-xs border border-slate-200/90 transition-all cursor-pointer group active:scale-[0.99]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EEF6E1] text-emerald-900 border border-emerald-200">
                            {vac.sphere}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            {vac.format}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-[14px] text-[#121316] group-hover:text-emerald-700 transition-colors leading-snug">
                          {vac.title}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[16px] font-black text-[#141517] block">
                          {vac.budget.toLocaleString('ru-RU')} ₽
                        </span>
                      </div>
                    </div>

                    <p className="text-[11.5px] text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {vac.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {vac.requiredSkills.map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700 truncate">{vac.companyName}</span>
                        <span className="text-slate-400">• {vac.city}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {hasApplied ? (
                          <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Отклик отправлен</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-extrabold text-black group-hover:text-emerald-700 flex items-center gap-1">
                            <span>Подробнее</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (

        <div className="space-y-3">
          {myApplicationsList.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 text-center border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">Вы пока не откликнулись ни на один кейс.</p>
              <button
                type="button"
                onClick={() => setSubTab('catalog')}
                className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
              >
                Перейти в каталог вакансий →
              </button>
            </div>
          ) : (
            myApplicationsList.map(({ app, vac, deal }) => (
              <div
                key={app.id}
                className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Отклик от {new Date(app.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    <h3 className="font-bold text-[13.5px] text-[#121316] mt-0.5">
                      {vac?.title || 'Кейс'}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-medium">{vac?.companyName}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">
                      {app.proposedPrice.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className="text-[10px] text-slate-400">Срок: {app.deliveryDays} дн.</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-2xl bg-slate-50 text-[11px] text-slate-700 italic border border-slate-100">
                  «{app.coverLetter}»
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-[#EEF6E1] text-emerald-900 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span>
                      {deal?.stage === 'completed'
                        ? 'Завершен & Оплачен'
                        : deal?.stage === 'in_progress'
                        ? 'В работе'
                        : deal?.stage === 'waiting_payment'
                        ? 'Ожидает оплаты СБП'
                        : 'В процессе общения'}
                    </span>
                  </span>

                  {deal && (
                    <button
                      type="button"
                      onClick={() => onOpenChatForDealId(deal.id)}
                      className="flex items-center gap-1.5 bg-[#141517] hover:bg-black text-[#BAEA55] text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition-all active:scale-95"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Открыть чат</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
