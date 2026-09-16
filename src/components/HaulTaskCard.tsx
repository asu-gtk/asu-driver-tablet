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
          actionColor: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-blue-500/20',
        };
      case 'LOADING':
        return {
          title: 'Идет цикл экскаваторной погрузки',
          target: 'ЭКГ-5А #2 • Загрузка ковш #3 / 5',
          dist: 'Осталось: ~1.5 мин',
          actionText: 'ПОГРУЗКА ЗАВЕРШЕНА',
          actionColor: 'from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 shadow-amber-500/20',
        };
      case 'TO_DUMP':
        return {
          title: 'Транспортировка горной массы',
          target: 'Отвал Восток (Приемный бункер ДСК-1)',
          dist: 'Расстояние: 3.4 км',
          actionText: 'НА ОТВАЛЕ',
          actionColor: 'from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-emerald-500/20',
        };
      case 'UNLOADING':
        return {
          title: 'Разгрузка в приемный бункер',
          target: 'Бункер #1 • Контроль габаритов',
          dist: 'Осталось: ~45 сек',
          actionText: 'СЛЕДУЮЩИЙ РЕЙС',
          actionColor: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-blue-500/20',
        };
    }
  };

  const details = getStageDetails();

  return (
    <div className="bg-white border-2 border-blue-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex-1 pr-4">
        <div className="flex items-center gap-3 mb-1">
          <span className="px-3 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-xs font-black font-mono uppercase tracking-wider">
            Рейс #{tripNumber} / {totalTripsTarget}
          </span>
          <span className="text-xs font-semibold text-slate-600">
            Тип: <span className="text-emerald-700 font-bold">Руда товарная</span>
          </span>
          <span className="text-xs text-slate-400 font-mono">• Плечо: 3.2 км</span>
        </div>

        <div className="text-lg font-black text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
          <span>{details.target}</span>
        </div>

        <div className="text-xs text-slate-500 mt-0.5 font-medium flex items-center gap-2">
          <span>{details.title}</span>
          <span className="font-mono text-blue-700 font-bold">({details.dist})</span>
        </div>
      </div>

      {/* Сенсорная кнопка действия водителя */}
      <button
        onClick={onAdvanceStage}
        className={`px-7 py-4 bg-gradient-to-r ${details.actionColor} text-white font-black text-sm tracking-wider uppercase rounded-xl flex items-center gap-2.5 shadow-md transition transform active:scale-95 shrink-0`}
      >
        <span>{details.actionText}</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
