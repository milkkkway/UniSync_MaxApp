import React, { useState } from 'react';
import { X, Copy, Check, Rocket, Shield, Terminal, Globe, Smartphone, Bot } from 'lucide-react';
import { maxBridge } from '../../services/maxBridge';

interface DeployGuideModalProps {
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copySnippet = (key: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    maxBridge.haptic('light');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="bg-[#141517] text-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 bg-[#181A1D] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#BAEA55] text-black flex items-center justify-center font-black">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Инструкция по деплою в мессенджер МАХ (2026)</h3>
              <p className="text-[10.5px] text-slate-400">Полный гайд подключения Mini App к боту и каталогу МАХ</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[#BAEA55] font-black text-xs">
              <Terminal className="w-4 h-4" />
              <span>Шаг 1. Сборка статических файлов Mini App</span>
            </div>
            <p>
              Приложение разработано на React 19 + TypeScript + Vite. Соберите статический production бандл:
            </p>
            <div className="bg-[#0E1012] p-2.5 rounded-xl font-mono text-[11px] text-emerald-300 flex items-center justify-between border border-white/5">
              <span>npm run build</span>
              <button
                type="button"
                onClick={() => copySnippet('build', 'npm run build')}
                className="text-slate-400 hover:text-white"
              >
                {copiedKey === 'build' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              В папке <code className="text-white">dist/</code> будет сгенерирован полностью оптимизированный HTML, JS и CSS.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-black text-xs">
              <Globe className="w-4 h-4" />
              <span>Шаг 2. Размещение на защищенном HTTPS хостинге</span>
            </div>
            <p>
              Согласно требованиям платформы МАХ, ссылка обязана быть по протоколу <strong className="text-white">HTTPS</strong> с действующим SSL-сертификатом и поддержкой безопасного фрейма.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li><strong className="text-white">VK Cloud</strong> — официальный хостинг мини-приложений МАХ со встроенной защитой трафика.</li>
              <li><strong className="text-white">Selectel / Yandex Cloud</strong> — для локализации персональных данных по 152-ФЗ РФ.</li>
              <li><strong className="text-white">GitHub Pages / Vercel</strong> — моментально подходит для быстрого тестирования и демо.</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-[#BAEA55] font-black text-xs">
              <Bot className="w-4 h-4" />
              <span>Шаг 3. Регистрация на Платформе MAX для партнёров</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>Откройте платформу для партнеров: <a href="https://partner.max.ru" target="_blank" rel="noreferrer" className="text-blue-400 underline">partner.max.ru</a> (или в боте «MAX для бизнеса»).</li>
              <li>Перейдите в раздел <strong className="text-white">«Чат-боты» → «Создать бота»</strong> (получите токен бота <code className="text-emerald-400">BOT_TOKEN</code>).</li>
              <li>Нажмите <strong className="text-white">⋮ → «Настройки»</strong> у созданного бота.</li>
              <li>В поле <strong className="text-white">«URL мини-приложения»</strong> вставьте вашу HTTPS-ссылку (например: <code className="text-[#BAEA55]">{'https://your-domain.ru/'}</code>).</li>
              <li>Выберите вид кнопки быстрого открытия: <strong className="text-white">«Открыть»</strong> или <strong className="text-white">«Старт»</strong> и нажмите «Сохранить».</li>
            </ol>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-black text-xs">
              <Smartphone className="w-4 h-4" />
              <span>Шаг 4. Настройка диплинков и шеринга</span>
            </div>
            <p>
              Чтобы открывать Mini App по ссылке в каналах, постах или внешних сайтах:
            </p>
            <div className="bg-[#0E1012] p-2.5 rounded-xl font-mono text-[10.5px] text-sky-300 flex items-center justify-between border border-white/5">
              <span>{'https://max.ru/CasesBot?startapp'}</span>
              <button
                type="button"
                onClick={() => copySnippet('deeplink', 'https://max.ru/CasesBot?startapp')}
                className="text-slate-400 hover:text-white"
              >
                {copiedKey === 'deeplink' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[10.5px] text-slate-400">
              Для перехода к конкретной вакансии передается payload: <code className="text-white">?startapp=vac_123</code>. Приложение считывает его через <code className="text-white">window.WebApp.initDataUnsafe.start_param</code>.
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-black text-xs">
              <Shield className="w-4 h-4" />
              <span>Шаг 5. Готовность к MAX Bridge SDK</span>
            </div>
            <p>
              В код приложения уже внедрены все функции MAX Bridge API:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10.5px] text-slate-400">
              <div className="p-2 rounded-xl bg-black/40">✓ Нативная кнопка BackButton</div>
              <div className="p-2 rounded-xl bg-black/40">✓ Тактильные отклики HapticFeedback</div>
              <div className="p-2 rounded-xl bg-black/40">✓ Шеринг карточек shareMaxContent</div>
              <div className="p-2 rounded-xl bg-black/40">✓ Корректный viewport 100vh</div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-[#181A1D] border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400">
            Готово к публикации в каталог мессенджера МАХ
          </span>
          <button
            type="button"
            onClick={onClose}
            className="bg-[#BAEA55] hover:bg-[#c2f35d] text-black font-extrabold px-4 py-2 rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
          >
            Понятно, закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
