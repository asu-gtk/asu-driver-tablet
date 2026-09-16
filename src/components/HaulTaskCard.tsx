import React from 'react';
import { MapPin, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export type TripStage = 'TO_EXCAVATOR' | 'LOADING' | 'TO_DUMP' | 'UNLOADING';

interface HaulTaskCardProps {
  tripStage: TripStage;
  tripNumber: number;
  totalTripsTarget: number;
  onAdvanceStage: () => void;
}

export function HaulTaskCard({ tripStage, tripNumber, totalTripsTarget, onAdvanceStage }: HaulTaskCardProps) {
  const getStageDetails = () => {
    switch (tripStage) {
      case 'TO_EXCAVATOR':
        return {
          title: 'Следовать под погрузку в забой',
          target: 'Экскаватор ЭКГ-5А #2 (Горизонт +1620м)',
          dist: 'Расстояние: 3.2 км',
          actionText: 'ПРИБЫЛ В ЗАБОЙ',
          actionColor: 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500',
        };
      case 'LOADING':
        return {
          title: 'Идет цикл экскаваторной погрузки',
          target: 'ЭКГ-5А #2 • Загрузка ковш #3 / 5',
          dist: 'Осталось: ~1.5 мин',
          actionText: 'ПОГРУЗКА ЗАВЕРШЕНА',
          actionColor: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
        };
      case 'TO_DUMP':
        return {
          title: 'Транспортировка горной массы',
          target: 'Отвал Восток (Приемный бункер ДСК-1)',
          dist: 'Расстояние: 3.4 км',
          actionText: 'НА ОТВАЛЕ',
          actionColor: 'from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600',
        };
      case 'UNLOADING':
        return {
          title: 'Разгрузка в приемный бункер',
          target: 'Бункер #1 • Контроль габаритов',
          dist: 'Осталось: ~45 сек',
          actionText: 'СЛЕДУЮЩИЙ РЕЙС',
          actionColor: 'from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500',
        };
    }
  };

  const details = getStageDetails();

  return (
    <div className="bg-[#151b24] border-2 border-[#e59b2b]/40 rounded-3xl p-5 flex items-center justify-between shadow-2xl">
      <div className="flex-1 pr-6">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 rounded-full text-xs font-bold font-mono uppercase tracking-wider">
            Рейс #{tripNumber} / {totalTripsTarget}
          </span>
          <span className="text-xs font-medium text-slate-400">
            Тип: <span className="text-emerald-400 font-bold">Руда золотосодержащая</span>
          </span>
          <span className="text-xs text-slate-500 font-mono">• Плечо: 3.2 км</span>
        </div>

        <div className="text-xl font-black text-slate-100 flex items-center gap-2.5">
          <MapPin className="w-6 h-6 text-amber-400 shrink-0" />
          <span>{details.target}</span>
        </div>

        <div className="text-xs text-slate-400 mt-0.5 font-medium flex items-center gap-2">
          <span>{details.title}</span>
          <span className="font-mono text-cyan-300">({details.dist})</span>
        </div>
      </div>

      {/* Большая сенсорная кнопка действия водителя */}
      <button
        onClick={onAdvanceStage}
        className={`px-8 py-5 bg-gradient-to-r ${details.actionColor} text-white font-black text-base tracking-wider uppercase rounded-2xl flex items-center gap-3 shadow-xl transition transform active:scale-95 shrink-0`}
      >
        <span>{details.actionText}</span>
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
}
