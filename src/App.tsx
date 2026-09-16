import React, { useState, useEffect } from 'react';
import { TopStatusBar } from './components/TopStatusBar';
import { NavigationMap } from './components/NavigationMap';
import { HaulTaskCard, TripStage } from './components/HaulTaskCard';
import { GaugesPanel } from './components/GaugesPanel';
import { PredictiveAdvisorCard, ScenarioType } from './components/PredictiveAdvisorCard';
import { NotificationCenter, DispatcherMessage } from './components/NotificationCenter';
import { voiceAdvisor } from './services/voiceAdvisor';

export default function App() {
  const [speed, setSpeed] = useState(29.2);
  const [payload, setPayload] = useState(128.5);
  const [fuel, setFuel] = useState(415);
  const [tripStage, setTripStage] = useState<TripStage>('TO_DUMP');
  const [tripNumber, setTripNumber] = useState(14);
  const [sosActive, setSosActive] = useState(false);
  const [scenario, setScenario] = useState<ScenarioType>('NORMAL');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [speedLimit, setSpeedLimit] = useState(40);
  const [notifOpen, setNotifOpen] = useState(false);

  const [messages, setMessages] = useState<DispatcherMessage[]>([
    {
      id: 'msg-1',
      time: '11:30',
      type: 'blast',
      title: 'Плановые взрывные работы (БВР)',
      body: 'В 13:00 запланированы БВР на горизонте +1680. Всем бортам покинуть опасную зону радиусом 500 м до 12:45.',
      acknowledged: false,
    },
    {
      id: 'msg-2',
      time: '11:15',
      type: 'info',
      title: 'Маршрутизация рейса',
      body: 'После рейса #14 ваш самосвал закреплен за забоем #7 (Hitachi EX3600) для поддержания плановой производительности.',
      acknowledged: true,
    },
  ]);

  const handleSelectScenario = (s: ScenarioType) => {
    setScenario(s);

    if (s === 'LOW_FUEL') {
      setFuel(75);
      if (voiceEnabled) {
        voiceAdvisor.speak('Внимание. Критический остаток топлива семьдесят пять литров. Рекомендуется заезд на заправщик на горизонте шестнадцать сорок.');
      }
    } else if (s === 'OBSTACLE') {
      if (voiceEnabled) {
        voiceAdvisor.speak('Внимание. На участке вираж юг обнаружена осыпь породы. Маршрут перестроен в объезд через сектор два.', 'urgent');
      }
    } else if (s === 'OVERLOAD') {
      setPayload(138.4);
      setSpeedLimit(20);
      if (voiceEnabled) {
        voiceAdvisor.speak('Предупреждение. Перегруз кузова сто тридцать восемь тонн. Включите ретардер и снизьте скорость до двадцати километров в час.');
      }
    } else if (s === 'QUEUE_REROUTE') {
      if (voiceEnabled) {
        voiceAdvisor.speak('Очередь под экскаватором номер два. Диспетчер перенаправил вас на свободный экскаватор Хитачи.');
      }
    } else if (s === 'NORMAL') {
      setFuel(415);
      setPayload(128.5);
      setSpeedLimit(40);
      if (voiceEnabled) {
        voiceAdvisor.speak('Параметры в норме. Следуйте по штатному маршруту.');
      }
    }
  };

  const handleAcceptRecommendation = () => {
    if (scenario === 'LOW_FUEL') {
      setActiveAlert('Маршрут перестроен: заезд на АТЗ-04 (+1640м) добавлен в план');
      setFuel(550);
      setScenario('NORMAL');
      if (voiceEnabled) voiceAdvisor.speak('Заезд на заправку подтвержден. Следуйте по стрелке навигатора.');
    } else if (scenario === 'OBSTACLE') {
      setActiveAlert('Объезд осыпи скалы через Сектор-2 подтвержден');
      setScenario('NORMAL');
      if (voiceEnabled) voiceAdvisor.speak('Объезд принят. Трасса безопасна.');
    } else if (scenario === 'OVERLOAD') {
      setActiveAlert('Скоростной режим 20 км/ч активирован, ретардер включен');
      setSpeed(19.5);
      setScenario('NORMAL');
    } else if (scenario === 'QUEUE_REROUTE') {
      setActiveAlert('Перенаправление на забой Hitachi EX3600 принято');
      setScenario('NORMAL');
      if (voiceEnabled) voiceAdvisor.speak('Маршрут на экскаватор Хитачи подтвержден.');
    } else {
      setActiveAlert('Штатный график подтвержден');
    }
    setTimeout(() => setActiveAlert(null), 3500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSpeed((prev) => {
        const maxLimit = scenario === 'OVERLOAD' ? 22 : 42;
        const delta = (Math.random() - 0.48) * 1.5;
        return Math.max(0, Math.min(maxLimit, Number((prev + delta).toFixed(1))));
      });
    }, 1200);
    return () => clearInterval(timer);
  }, [scenario]);

  const handleAdvanceStage = () => {
    if (tripStage === 'TO_EXCAVATOR') {
      setTripStage('LOADING');
      setSpeedLimit(20);
      if (voiceEnabled) voiceAdvisor.speak('Прибытие в забой зафиксировано. Идет погрузка.');
    } else if (tripStage === 'LOADING') {
      setPayload(129.8);
      setTripStage('TO_DUMP');
      setSpeedLimit(40);
      if (voiceEnabled) voiceAdvisor.speak('Погрузка завершена. Следуйте на отвал Восток.');
    } else if (tripStage === 'TO_DUMP') {
      setTripStage('UNLOADING');
      setSpeedLimit(15);
      if (voiceEnabled) voiceAdvisor.speak('Прибыли на отвал. Начните разгрузку кузова.');
    } else if (tripStage === 'UNLOADING') {
      setPayload(0.0);
      setTripNumber((n) => n + 1);
      setTripStage('TO_EXCAVATOR');
      setSpeedLimit(40);
      if (voiceEnabled) voiceAdvisor.speak(`Разгрузка завершена. Начат рейс номер ${tripNumber + 1}.`);
    }
  };

  const handleAcknowledgeMessage = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, acknowledged: true } : m))
    );
    setActiveAlert('Ознакомление с распоряжением подтверждено диспетчеру');
    setTimeout(() => setActiveAlert(null), 3000);
  };

  const handleSendReport = (type: string, note: string) => {
    setActiveAlert(`Доклад "${type}" отправлен диспетчеру`);
    setTimeout(() => setActiveAlert(null), 3500);
  };

  const handleQuickAction = (action: string) => {
    if (action === 'break') {
      setActiveAlert('Запрос перерыва передан диспетчеру');
      if (voiceEnabled) voiceAdvisor.speak('Запрос обеденного перерыва передан диспетчеру.');
    } else if (action === 'service') {
      setActiveAlert('Топливозаправщик вызван в сектор 3');
      if (voiceEnabled) voiceAdvisor.speak('Вызов технической службы зарегистрирован.');
    }
    setTimeout(() => setActiveAlert(null), 3500);
  };

  const unreadCount = messages.filter((m) => !m.acknowledged).length;

  return (
    <div className="h-screen w-screen bg-slate-100 p-3.5 flex flex-col gap-2.5 font-sans overflow-hidden select-none">
      {/* Верхний статус-бар планшета */}
      <TopStatusBar
        truckId="101"
        driverName="Доржиев Э. Д."
        shiftName="Смена #1 (08:00 – 20:00)"
        sosActive={sosActive}
        unreadAlertsCount={unreadCount}
        onOpenNotifications={() => setNotifOpen(true)}
        onToggleSos={() => {
          setSosActive(!sosActive);
          if (!sosActive && voiceEnabled) {
            voiceAdvisor.speak('Внимание! Сигнал аварии и координаты самосвала отправлены в диспетчерский центр.', 'urgent');
          }
        }}
      />

      {/* Всплывающий модальный центр сообщений */}
      <NotificationCenter
        messages={messages}
        onAcknowledge={handleAcknowledgeMessage}
        onSendReport={handleSendReport}
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />

      {/* Оповещение быстрого действия */}
      {activeAlert && (
        <div className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black text-center text-xs tracking-wider uppercase shadow-md transition animate-fade-in">
          {activeAlert}
        </div>
      )}

      {/* Основной двухколоночный лейаут */}
      <div className="flex-1 grid grid-cols-12 gap-3 min-h-0">
        {/* Левая колонка: Векторная навигационная карта (Google Maps 2.5D) и активное задание */}
        <div className="col-span-8 flex flex-col gap-2.5 min-h-0">
          <div className="flex-1 min-h-0">
            <NavigationMap speed={speed} scenario={scenario} speedLimit={speedLimit} />
          </div>

          <HaulTaskCard
            tripStage={tripStage}
            tripNumber={tripNumber}
            totalTripsTarget={18}
            onAdvanceStage={handleAdvanceStage}
          />
        </div>

        {/* Правая колонка: Предиктивный советник ИИ, приборы HUD, датчики */}
        <div className="col-span-4 flex flex-col gap-2.5 min-h-0 overflow-y-auto pr-0.5">
          <PredictiveAdvisorCard
            scenario={scenario}
            voiceEnabled={voiceEnabled}
            onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
            onSelectScenario={handleSelectScenario}
            onAcceptRecommendation={handleAcceptRecommendation}
          />

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
