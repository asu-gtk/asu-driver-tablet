import React from 'react';
import { Gauge, Weight, Fuel, Coffee, Wrench, ShieldAlert } from 'lucide-react';

interface GaugesPanelProps {
  speed: number;
  payload: number;
  fuel: number;
  onQuickAction: (action: string) => void;
}

export function GaugesPanel({ speed, payload, fuel, onQuickAction }: GaugesPanelProps) {
  const payloadPercent = Math.min(100, Math.round((payload / 130) * 100));
  const fuelPercent = Math.min(100, Math.round((fuel / 600) * 100));

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Спидометр */}
      <div className="bg-[#151b24] border border-[#232c3b] rounded-3xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-950/50 border border-cyan-700/40 flex items-center justify-center text-cyan-400">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Скорость</div>
            <div className="text-3xl font-black font-mono text-cyan-300 tracking-tight">
              {speed} <span className="text-xs text-slate-400 font-sans font-semibold">км/ч</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400">Ограничение</div>
          <div className="text-sm font-bold font-mono text-amber-400">40 км/ч</div>
        </div>
      </div>

      {/* Вес в кузове / Тензодатчики */}
      <div className="bg-[#151b24] border border-[#232c3b] rounded-3xl p-4 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/50 border border-emerald-700/40 flex items-center justify-center text-emerald-400">
              <Weight className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Вес в кузове</div>
              <div className="text-3xl font-black font-mono text-emerald-300 tracking-tight">
                {payload} <span className="text-xs text-slate-400 font-sans font-semibold">т</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Номинал</div>
            <div className="text-sm font-bold font-mono text-slate-200">130.0 т</div>
          </div>
        </div>

        {/* Индикатор загрузки */}
        <div className="w-full bg-[#0f131a] rounded-full h-2.5 overflow-hidden border border-[#232c3b]">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              payloadPercent > 105 ? 'bg-red-500' : payloadPercent > 80 ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, payloadPercent)}%` }}
          ></div>
        </div>
      </div>

      {/* Уровень топлива */}
      <div className="bg-[#151b24] border border-[#232c3b] rounded-3xl p-4 flex flex-col justify-between shadow-md">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-950/50 border border-amber-700/40 flex items-center justify-center text-amber-400">
              <Fuel className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Топливо в баке</div>
              <div className="text-3xl font-black font-mono text-amber-300 tracking-tight">
                {fuel} <span className="text-xs text-slate-400 font-sans font-semibold">л</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Остаток смены</div>
            <div className="text-sm font-bold font-mono text-slate-200">~6.5 ч</div>
          </div>
        </div>

        {/* Индикатор бака */}
        <div className="w-full bg-[#0f131a] rounded-full h-2.5 overflow-hidden border border-[#232c3b]">
          <div
            className="h-full bg-amber-500 transition-all duration-500 rounded-full"
            style={{ width: `${fuelPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Быстрые статусные кнопки водителя */}
      <div className="grid grid-cols-2 gap-2.5 flex-1">
        <button
          onClick={() => onQuickAction('break')}
          className="bg-[#151b24] hover:bg-[#1f2837] active:scale-95 border border-[#232c3b] rounded-3xl p-3.5 text-left transition flex flex-col justify-between shadow-md"
        >
          <Coffee className="w-6 h-6 text-amber-400 mb-1" />
          <div>
            <div className="text-xs font-bold text-slate-200">Тех. перерыв</div>
            <div className="text-[10px] text-slate-400">Обед / Отдых 30 мин</div>
          </div>
        </button>

        <button
          onClick={() => onQuickAction('service')}
          className="bg-[#151b24] hover:bg-[#1f2837] active:scale-95 border border-[#232c3b] rounded-3xl p-3.5 text-left transition flex flex-col justify-between shadow-md"
        >
          <Wrench className="w-6 h-6 text-blue-400 mb-1" />
          <div>
            <div className="text-xs font-bold text-slate-200">Запрос ТО / ГСМ</div>
            <div className="text-[10px] text-slate-400">Топливозаправщик</div>
          </div>
        </button>
      </div>
    </div>
  );
}
