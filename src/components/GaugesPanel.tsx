import React from 'react';
import { Gauge, Weight, Fuel, Coffee, Wrench } from 'lucide-react';

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
    <div className="flex flex-col gap-2.5 h-full">
      {/* Спидометр */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Скорость</div>
            <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
              {speed} <span className="text-xs text-slate-500 font-sans font-semibold">км/ч</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400">Лимит</div>
          <div className="text-xs font-bold font-mono text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            40 км/ч
          </div>
        </div>
      </div>

      {/* Вес в кузове */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Weight className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Вес в кузове</div>
              <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                {payload} <span className="text-xs text-slate-500 font-sans font-semibold">т</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Номинал</div>
            <div className="text-xs font-bold font-mono text-slate-700">130.0 т</div>
          </div>
        </div>

        {/* Индикатор загрузки */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              payloadPercent > 105 ? 'bg-red-500' : payloadPercent > 80 ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, payloadPercent)}%` }}
          ></div>
        </div>
      </div>

      {/* Уровень топлива */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col justify-between shadow-sm">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Fuel className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Топливо в баке</div>
              <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                {fuel} <span className="text-xs text-slate-500 font-sans font-semibold">л</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Остаток</div>
            <div className="text-xs font-bold font-mono text-slate-700">~6.5 ч</div>
          </div>
        </div>

        {/* Индикатор бака */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              fuel <= 80 ? 'bg-amber-500' : 'bg-blue-500'
            }`}
            style={{ width: `${fuelPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Быстрые статусные кнопки водителя */}
      <div className="grid grid-cols-2 gap-2 flex-1">
        <button
          onClick={() => onQuickAction('break')}
          className="bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 rounded-2xl p-3 text-left transition flex flex-col justify-between shadow-sm"
        >
          <Coffee className="w-5 h-5 text-amber-600 mb-1" />
          <div>
            <div className="text-xs font-bold text-slate-800">Тех. перерыв</div>
            <div className="text-[10px] text-slate-500 font-medium">Обед / Отдых 30 мин</div>
          </div>
        </button>

        <button
          onClick={() => onQuickAction('service')}
          className="bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 rounded-2xl p-3 text-left transition flex flex-col justify-between shadow-sm"
        >
          <Wrench className="w-5 h-5 text-blue-600 mb-1" />
          <div>
            <div className="text-xs font-bold text-slate-800">Запрос ТО / ГСМ</div>
            <div className="text-[10px] text-slate-500 font-medium">Топливозаправщик</div>
          </div>
        </button>
      </div>
    </div>
  );
}
