import React, { useState, useEffect } from 'react';
import { TopStatusBar } from './components/TopStatusBar';
import { NavigationMap } from './components/NavigationMap';
import { HaulTaskCard, TripStage } from './components/HaulTaskCard';
import { GaugesPanel } from './components/GaugesPanel';

export default function App() {
  const [speed, setSpeed] = useState(29.2);
  const [payload, setPayload] = useState(128.5);
  const [fuel, setFuel] = useState(415);
  const [tripStage, setTripStage] = useState<TripStage>('TO_DUMP');
  const [tripNumber, setTripNumber] = useState(14);
  const [sosActive, setSosActive] = useState(false);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Имитация телеметрии скорости и датчиков
  useEffect(() => {
    const timer = setInterval(() => {
      setSpeed((prev) => {
        const delta = (Math.random() - 0.48) * 1.6;
        return Math.max(0, Math.min(42, Number((prev + delta).toFixed(1))));
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const handleAdvanceStage = () => {
    if (tripStage === 'TO_EXCAVATOR') {
      setTripStage('LOADING');
    } else if (tripStage === 'LOADING') {
      setPayload(129.8);
      setTripStage('TO_DUMP');
    } else if (tripStage === 'TO_DUMP') {
      setTripStage('UNLOADING');
    } else if (tripStage === 'UNLOADING') {
      setPayload(0.0);
      setTripNumber((n) => n + 1);
      setTripStage('TO_EXCAVATOR');
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'break') {
      setActiveAlert('Запрос перерыва передан диспетчеру');
    } else if (action === 'service') {
      setActiveAlert('Топливозаправщик вызван в сектор 3');
    }
    setTimeout(() => setActiveAlert(null), 3500);
  };

  return (
    <div className="h-screen w-screen bg-[#0e1218] p-4 flex flex-col gap-3 font-sans overflow-hidden select-none">
      {/* Верхний статус-бар планшета */}
      <TopStatusBar
        truckId="101"
        driverName="Доржиев Э. Д."
        shiftName="Смена #1 (08:00 – 20:00)"
        sosActive={sosActive}
        onToggleSos={() => setSosActive(!sosActive)}
      />

      {/* Оповещение быстрого действия */}
      {activeAlert && (
        <div className="bg-amber-500/95 text-slate-950 px-6 py-2 rounded-2xl font-bold text-center text-sm shadow-xl transition animate-fade-in">
          {activeAlert}
        </div>
      )}

      {/* Основной двухколоночный лейаут */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
        {/* Левая колонка: Векторная навигационная карта и активное рейсовое задание */}
        <div className="col-span-8 flex flex-col gap-3 min-h-0">
          <div className="flex-1 min-h-0">
            <NavigationMap speed={speed} />
          </div>

          <HaulTaskCard
            tripStage={tripStage}
            tripNumber={tripNumber}
            totalTripsTarget={18}
            onAdvanceStage={handleAdvanceStage}
          />
        </div>

        {/* Правая колонка: Приборы HUD, тензодатчики, уровень топлива, быстрые вызовы */}
        <div className="col-span-4 min-h-0">
          <GaugesPanel
            speed={speed}
            payload={payload}
            fuel={fuel}
            onQuickAction={handleQuickAction}
          />
        </div>
      </div>
    </div>
  );
}
