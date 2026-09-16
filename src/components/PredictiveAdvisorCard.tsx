import React from 'react';
import {
  Brain,
  AlertTriangle,
  Fuel,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Construction,
  CheckCircle2
} from 'lucide-react';

export type ScenarioType = 'NORMAL' | 'LOW_FUEL' | 'OBSTACLE' | 'OVERLOAD' | 'QUEUE_REROUTE';

interface PredictiveAdvisorCardProps {
  scenario: ScenarioType;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onSelectScenario: (s: ScenarioType) => void;
  onAcceptRecommendation: () => void;
}

export function PredictiveAdvisorCard({
  scenario,
  voiceEnabled,
  onToggleVoice,
  onSelectScenario,
  onAcceptRecommendation,
}: PredictiveAdvisorCardProps) {
  const getScenarioContent = () => {
    switch (scenario) {
      case 'LOW_FUEL':
        return {
          badge: 'КРИТИЧЕСКИЙ ОСТАТОК ТОПЛИВА',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          title: 'Остаток в баке: 75 л (~45 мин работы)',
          prediction: 'Прогноз: топлива не хватит на следующий полный рейс с подъемом на Отвал Восток (+7%).',
          recommendation: 'Рекомендация ИИ: После разгрузки текущего рейса #14 свернуть на АТЗ-04 (Горизонт +1640, плечо 600м).',
          actionText: 'ПРИНЯТЬ ЗАЕЗД НА АЗС',
          icon: <Fuel className="w-5 h-5 text-amber-600 animate-bounce" />,
          borderStyle: 'border-amber-300 shadow-amber-500/10',
        };
      case 'OBSTACLE':
        return {
          badge: 'ОПАСНОСТЬ НА МАРШРУТЕ • ИНЦИДЕНТ',
          badgeColor: 'bg-red-100 text-red-900 border-red-300',
          title: 'Осыпь скальной породы на участке «Вираж Юг» (ПК-18)',
          prediction: 'Прогноз: полная блокировка проезда. Риск повреждения шин и задержки рейса на 40+ минут.',
          recommendation: 'Рекомендация ИИ: Маршрут автоматически перестроен в объезд через технологический вираж Сектор-2 (+350 м).',
          actionText: 'ПОДТВЕРДИТЬ ОБЪЕЗД',
          icon: <Construction className="w-5 h-5 text-red-600 animate-pulse" />,
          borderStyle: 'border-red-300 shadow-red-500/10',
        };
      case 'OVERLOAD':
        return {
          badge: 'ПРЕДУПРЕЖДЕНИЕ ПО БЕЗОПАСНОСТИ',
          badgeColor: 'bg-orange-100 text-orange-900 border-orange-300',
          title: 'Перегруз кузова: 138.4 т (+8.4 т выше нормы)',
          prediction: 'Прогноз: повышенный нагрев шин (индекс TKPH > 420) и риск отказа тормозной системы на уклоне -6%.',
          recommendation: 'Рекомендация ИИ: Активировать гидродинамический ретардер, ограничить скорость спуска до 20 км/ч.',
          actionText: 'ПОНЯЛ, СНИЖАЮ СКОРОСТЬ',
          icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
          borderStyle: 'border-orange-300 shadow-orange-500/10',
        };
      case 'QUEUE_REROUTE':
        return {
          badge: 'ОПТИМИЗАЦИЯ ТРАФИКА В ЗАБОЕ',
          badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
          title: 'Очередь под погрузку в забое ЭКГ-5А #2 (>3 машин)',
          prediction: 'Прогноз: простой под экскаватором 12 минут. Потеря производительности -38 т/час.',
          recommendation: 'Рекомендация ИИ: Симплекс перенаправил на свободный экскаватор Hitachi EX3600 (Забой #7, время подачи 0 мин).',
          actionText: 'СЛЕДОВАТЬ НА ЗАБОЙ #7',
          icon: <Sparkles className="w-5 h-5 text-blue-600" />,
          borderStyle: 'border-blue-300 shadow-blue-500/10',
        };
      case 'NORMAL':
      default:
        return {
          badge: 'ПРЕДИКТИВНЫЙ АССИСТЕНТ • ШТАТНЫЙ РЕЖИМ',
          badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          title: 'Трасса свободна, параметры машины в норме',
          prediction: 'Прогноз: сменный план (18 рейсов) будет выполнен к 19:20 с опережением графика на 15 минут.',
          recommendation: 'Рекомендация ИИ: Держать крейсерскую скорость 28–30 км/ч для оптимального расхода топлива (0.158 л/т).',
          actionText: 'РЕЙС В ГРАФИКЕ',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
          borderStyle: 'border-slate-200',
        };
    }
  };

  const c = getScenarioContent();

  return (
    <div className={`bg-white border-2 ${c.borderStyle} rounded-2xl p-3.5 shadow-sm flex flex-col justify-between transition-all duration-300`}>
      {/* Шапка предиктивного блока */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {c.icon}
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono tracking-wider uppercase border ${c.badgeColor}`}>
            {c.badge}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
              voiceEnabled ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{voiceEnabled ? 'Голос ВКЛ' : 'Голос ВЫКЛ'}</span>
          </button>
        </div>
      </div>

      {/* Текст ситуации и прогноз */}
      <div className="space-y-1 mb-2.5">
        <div className="text-sm font-extrabold text-slate-900">{c.title}</div>
        <div className="text-xs text-slate-600 font-medium">{c.prediction}</div>
        <div className="text-xs text-slate-900 font-bold bg-amber-50 p-2 rounded-xl border border-amber-200">
          {c.recommendation}
        </div>
      </div>

      {/* Кнопка действия + Переключатель симуляции для демонстрации */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Тест:</span>
          <button
            onClick={() => onSelectScenario('NORMAL')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
              scenario === 'NORMAL' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Норма
          </button>
          <button
            onClick={() => onSelectScenario('LOW_FUEL')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
              scenario === 'LOW_FUEL' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Топливо
          </button>
          <button
            onClick={() => onSelectScenario('OBSTACLE')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
              scenario === 'OBSTACLE' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Осыпь
          </button>
          <button
            onClick={() => onSelectScenario('OVERLOAD')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
              scenario === 'OVERLOAD' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Перегруз
          </button>
          <button
            onClick={() => onSelectScenario('QUEUE_REROUTE')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
              scenario === 'QUEUE_REROUTE' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Очередь
          </button>
        </div>

        <button
          onClick={onAcceptRecommendation}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center gap-1 transition shadow-sm shrink-0"
        >
          <span>{c.actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
