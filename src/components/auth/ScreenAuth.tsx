import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { maxBridge } from '../../services/maxBridge';
import { GraduationCap, Briefcase, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, Sparkles, Building2 } from 'lucide-react';
import { UserRole } from '../../types';

export const ScreenAuth: React.FC = () => {
  const { login, registerStudent, registerEmployer, quickLogin } = useApp();

  const [mode, setMode] = useState<'welcome' | 'register_student' | 'register_employer' | 'login'>('welcome');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [inn, setInn] = useState('');

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (lockoutTime > 0) {
      const interval = setInterval(() => {
        setLockoutTime((t) => Math.max(0, t - 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime]);

  const handleRoleContinue = () => {
    maxBridge.haptic('medium');
    if (selectedRole === 'student') {
      setMode('register_student');
    } else {
      setMode('register_employer');
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg('Пожалуйста, введите ваше имя.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Введите корректный email адрес.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Пароль должен быть не короче 6 символов.');
      return;
    }

    const res = registerStudent({ name: fullName, email, pass: password });
    if (!res.success) {
      setErrorMsg(res.message || 'Ошибка регистрации');
    }
  };

  const handleEmployerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!fullName.trim()) {
      setErrorMsg('Введите имя контактного лица.');
      return;
    }
    if (!companyName.trim()) {
      setErrorMsg('Введите название компании или проекта.');
      return;
    }
    if (inn && inn.length !== 10 && inn.length !== 12) {
      setErrorMsg('ИНН должен содержать 10 цифр (юрлицо) или 12 цифр (ИП). Либо оставьте поле пустым.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Введите корректный email адрес.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Пароль должен быть не короче 6 символов.');
      return;
    }

    const res = registerEmployer({
      name: fullName,
      companyName,
      email,
      pass: password,
      inn,
    });
    if (!res.success) {
      setErrorMsg(res.message || 'Ошибка регистрации');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (lockoutTime > 0) {
      setErrorMsg(`Слишком много попыток. Подождите ${lockoutTime} сек.`);
      return;
    }

    const res = login(email, password);
    if (!res.success) {
      const nextFails = failedAttempts + 1;
      setFailedAttempts(nextFails);
      if (nextFails >= 5) {
        setLockoutTime(600); 
        setErrorMsg('Лимит попыток исчерпан. Аккаунт заблокирован на 10 минут.');
      } else {
        setErrorMsg(`${res.message || 'Неверные данные'} (Попытка ${nextFails} из 5)`);
      }
      maxBridge.hapticNotification('error');
    } else {
      setFailedAttempts(0);
    }
  };

  return (
    <div className="w-full flex-1 min-h-0 flex flex-col justify-between px-3.5 pt-3 pb-8 overflow-y-auto">
      {mode === 'welcome' && (
        <div className="flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="bg-[#141517] text-white rounded-3xl p-4 shadow-xl border border-white/5 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#BAEA55] text-black flex items-center justify-center font-black text-xl shadow-md">
                M
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-[16px] text-white">МАХ Кейсы Бот</h1>
                  <span className="w-2 h-2 rounded-full bg-[#BAEA55] animate-ping" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Биржа проектов & талантов • VK 2026</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 text-xs text-slate-300 leading-relaxed">
              Добро пожаловать в официальный Mini App для поиска реальных проектов, кейсов и стажировок в мессенджере МАХ.
              Выберите свою роль, чтобы начать работу:
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div
              onClick={() => {
                maxBridge.haptic('light');
                setSelectedRole('student');
              }}
              className={`p-4 rounded-3xl cursor-pointer transition-all border-2 relative flex flex-col justify-between min-h-[140px] shadow-sm ${
                selectedRole === 'student'
                  ? 'bg-white border-[#BAEA55] shadow-md scale-[1.01]'
                  : 'bg-white/80 border-transparent hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-[#EEF6E1] text-[#141517] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-emerald-700" />
                  </div>
                  {selectedRole === 'student' && (
                    <span className="w-6 h-6 rounded-full bg-[#BAEA55] text-black flex items-center justify-center font-black text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-[#121316]">🎓 Студент</h3>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  Реальные кейсы в портфолио, первый коммерческий опыт, отклики на задачи и выплаты по СБП.
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 mt-2 block">
                Бесплатно для учащихся ВУЗов
              </span>
            </div>

            <div
              onClick={() => {
                maxBridge.haptic('light');
                setSelectedRole('employer');
              }}
              className={`p-4 rounded-3xl cursor-pointer transition-all border-2 relative flex flex-col justify-between min-h-[140px] shadow-sm ${
                selectedRole === 'employer'
                  ? 'bg-[#141517] text-white border-[#BAEA55] shadow-md scale-[1.01]'
                  : 'bg-white/80 text-slate-800 border-transparent hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${selectedRole === 'employer' ? 'bg-white/10 text-[#BAEA55]' : 'bg-slate-100 text-slate-700'}`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  {selectedRole === 'employer' && (
                    <span className="w-6 h-6 rounded-full bg-[#BAEA55] text-black flex items-center justify-center font-black text-xs">
                      ✓
                    </span>
                  )}
                </div>
                <h3 className={`font-extrabold text-sm ${selectedRole === 'employer' ? 'text-white' : 'text-[#121316]'}`}>
                  💼 Работодатель
                </h3>
                <p className={`text-[11px] mt-1 leading-snug ${selectedRole === 'employer' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Публикация кейсов и задач, доступ к базе мотивированных студентов Бауманки, ВШЭ, МГУ, сделки и отзывы.
                </p>
              </div>
              <span className={`text-[10px] font-bold mt-2 block ${selectedRole === 'employer' ? 'text-[#BAEA55]' : 'text-slate-700'}`}>
                Быстрый найм и недорогая рабочая сила
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleRoleContinue}
              className="w-full bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>Зарегистрироваться как {selectedRole === 'student' ? 'Студент' : 'Работодатель'}</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => {
                maxBridge.haptic('light');
                setMode('login');
              }}
              className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-2.5 px-4 rounded-2xl shadow-xs transition-all active:scale-95 text-xs text-center border border-slate-200 cursor-pointer"
            >
              Уже есть аккаунт? Войти в систему
            </button>
          </div>
        </div>
      )}

      {mode === 'register_student' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setMode('welcome')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-black py-1 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад к выбору роли</span>
          </button>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🎓</span>
              <h2 className="font-extrabold text-base text-[#121316]">Регистрация Студента</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Заполните данные для создания профиля и начала откликов на кейсы
            </p>

            {errorMsg && (
              <div className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleStudentSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">ФИО студента *</label>
                <input
                  type="text"
                  required
                  placeholder="Иван Иванов"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Электронная почта (Email) *</label>
                <input
                  type="email"
                  required
                  placeholder="student@university.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Пароль (не менее 6 знаков) *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 pr-10 focus:outline-hidden focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-400">
                Пароль сохраняется в хешированном виде. Восстановление пароля возможно через поддержку бота.
              </p>

              <button
                type="submit"
                className="w-full bg-[#141517] hover:bg-black text-[#BAEA55] font-extrabold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs mt-2 cursor-pointer"
              >
                Создать аккаунт студента →
              </button>
            </form>
          </div>
        </div>
      )}

      {mode === 'register_employer' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setMode('welcome')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-black py-1 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад к выбору роли</span>
          </button>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">💼</span>
              <h2 className="font-extrabold text-base text-[#121316]">Регистрация Работодателя</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Создайте профиль компании для публикации кейсов и найма студентов
            </p>

            {errorMsg && (
              <div className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleEmployerSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">ФИО представителя *</label>
                <input
                  type="text"
                  required
                  placeholder="Алексей Смирнов"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Название компании / проекта *</label>
                <input
                  type="text"
                  required
                  placeholder="ООO «ВК Студио» или ИП"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  ИНН компании (опционально, 10 или 12 цифр)
                </label>
                <input
                  type="text"
                  maxLength={12}
                  placeholder="7743013902"
                  value={inn}
                  onChange={(e) => setInn(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Электронная почта (Email) *</label>
                <input
                  type="email"
                  required
                  placeholder="lead@company.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Пароль (не менее 6 знаков) *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 pr-10 focus:outline-hidden focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#141517] hover:bg-black text-[#BAEA55] font-extrabold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs mt-2 cursor-pointer"
              >
                Зарегистрировать компанию →
              </button>
            </form>
          </div>
        </div>
      )}

      {mode === 'login' && (
        <div className="flex flex-col gap-3 animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setMode('welcome')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-black py-1 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
            <h2 className="font-extrabold text-base text-[#121316] mb-1">Вход в МАХ Кейсы</h2>
            <p className="text-xs text-slate-500 mb-4">Введите ваш логин и пароль для продолжения</p>

            {errorMsg && (
              <div className="mb-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="alex@bmstu.ru или lead@vktech.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-black"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Пароль</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 pr-10 focus:outline-hidden focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-black"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={lockoutTime > 0}
                className={`w-full font-extrabold py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 text-xs mt-2 cursor-pointer ${
                  lockoutTime > 0
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-[#BAEA55] hover:bg-[#c2f35d] text-black'
                }`}
              >
                {lockoutTime > 0 ? `Блокировка (${lockoutTime}с)` : 'Войти в личный кабинет →'}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <button
                type="button"
                onClick={() => setMode('welcome')}
                className="text-xs font-bold text-slate-700 hover:text-black"
              >
                Нет аккаунта? Зарегистрироваться
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="py-2 text-center text-[10px] text-slate-500 select-none">
        Платформа МАХ 2026 • VK Group • Защищённая сделка по 152-ФЗ РФ
      </div>
    </div>
  );
};
