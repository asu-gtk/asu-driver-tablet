import React, { useRef, useEffect, useState } from 'react';
import {
  Compass,
  Navigation2,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
  Fuel,
  Construction,
  Layers,
  Eye,
  RotateCw,
  Gauge
} from 'lucide-react';
import { ScenarioType } from './PredictiveAdvisorCard';

interface Waypoint {
  x: number;
  y: number;
  label: string;
  sub: string;
  type: 'loading' | 'dump' | 'turn' | 'fork' | 'fuel' | 'obstacle';
  altitude: number;
}

interface NavigationMapProps {
  speed: number;
  scenario: ScenarioType;
  speedLimit: number;
}

export function NavigationMap({ speed, scenario, speedLimit }: NavigationMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0.28);
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'heading' | 'overview'>('heading'); // 'heading' = Google Maps 2.5D по ходу движения, 'overview' = 2D обзор всей карты

  // Штатные контрольные точки трассы карьера
  const standardWaypoints: Waypoint[] = [
    { x: 100, y: 380, label: 'ЭКГ-5А #2', sub: 'Забой +1620', type: 'loading', altitude: 1620 },
    { x: 180, y: 300, label: 'Вираж Юг', sub: 'R=40м', type: 'turn', altitude: 1630 },
    { x: 300, y: 240, label: 'Разъезд #3', sub: 'Двухполосный', type: 'fork', altitude: 1648 },
    { x: 440, y: 140, label: 'Трасса Восток', sub: 'Уклон +7%', type: 'turn', altitude: 1665 },
    { x: 580, y: 70, label: 'Отвал Восток', sub: 'Приемный бункер', type: 'dump', altitude: 1680 },
  ];

  // Трасса в объезд при осыпи скалы (OBSTACLE)
  const detourWaypoints: Waypoint[] = [
    { x: 100, y: 380, label: 'ЭКГ-5А #2', sub: 'Забой +1620', type: 'loading', altitude: 1620 },
    { x: 150, y: 340, label: 'Съезд на объезд', sub: 'ПК-12', type: 'fork', altitude: 1625 },
    { x: 250, y: 360, label: 'Вираж Сектор-2', sub: 'Объезд осыпи (+350м)', type: 'turn', altitude: 1635 },
    { x: 360, y: 270, label: 'Выезд на Трассу #4', sub: 'Безопасный участок', type: 'fork', altitude: 1650 },
    { x: 440, y: 140, label: 'Трасса Восток', sub: 'Уклон +7%', type: 'turn', altitude: 1665 },
    { x: 580, y: 70, label: 'Отвал Восток', sub: 'Приемный бункер', type: 'dump', altitude: 1680 },
  ];

  // Маршрут через АТЗ-04 при низком топливе (LOW_FUEL)
  const fuelWaypoints: Waypoint[] = [
    { x: 100, y: 380, label: 'ЭКГ-5А #2', sub: 'Забой +1620', type: 'loading', altitude: 1620 },
    { x: 180, y: 300, label: 'Вираж Юг', sub: 'R=40м', type: 'turn', altitude: 1630 },
    { x: 270, y: 260, label: 'Заправщик АТЗ-04', sub: 'Горизонт +1640', type: 'fuel', altitude: 1640 },
    { x: 440, y: 140, label: 'Трасса Восток', sub: 'Уклон +7%', type: 'turn', altitude: 1665 },
    { x: 580, y: 70, label: 'Отвал Восток', sub: 'Приемный бункер', type: 'dump', altitude: 1680 },
  ];

  const waypoints = scenario === 'OBSTACLE' ? detourWaypoints : scenario === 'LOW_FUEL' ? fuelWaypoints : standardWaypoints;

  const nearbyVehicles = [
    { x: 350, y: 210, code: 'БелАЗ-104', status: 'Встречный', dist: '240 м' },
    { x: 140, y: 330, code: 'БелАЗ-108', status: 'В забое', dist: '620 м' },
  ];

  // Плавное движение
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 0.99 ? 0.02 : p + 0.0022));
    }, 45);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.save();

    // Расчет текущей позиции и угла движения машины
    const totalSegments = waypoints.length - 1;
    const curIdx = Math.min(totalSegments - 1, Math.floor(progress * totalSegments));
    const subProg = (progress * totalSegments) - curIdx;

    const p1 = waypoints[curIdx];
    const p2 = waypoints[curIdx + 1];

    const curX = p1.x + (p2.x - p1.x) * subProg;
    const curY = p1.y + (p2.y - p1.y) * subProg;
    const truckHeading = Math.atan2(p2.y - p1.y, p2.x - p1.x);

    // Если режим 'heading' (как в Google Maps): вращаем и центрируем карту относительно самосвала
    if (viewMode === 'heading') {
      ctx.translate(w / 2, h * 0.65);
      ctx.rotate(-truckHeading - Math.PI / 2);
      ctx.translate(-curX, -curY);
    }

    // Чистый светлый фон дневной навигации
    ctx.fillStyle = '#f8fafc';
    if (viewMode === 'heading') {
      // Заполняем с запасом для вращения
      ctx.fillRect(-w * 2, -h * 2, w * 4, h * 4);
    } else {
      ctx.fillRect(0, 0, w, h);
    }

    // Координатная сетка
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const gridStart = viewMode === 'heading' ? -600 : 0;
    const gridEnd = viewMode === 'heading' ? 1200 : w;
    for (let x = gridStart; x < gridEnd; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, gridStart);
      ctx.lineTo(x, gridEnd);
      ctx.stroke();
    }
    for (let y = gridStart; y < gridEnd; y += 40) {
      ctx.beginPath();
      ctx.moveTo(gridStart, y);
      ctx.lineTo(gridEnd, y);
      ctx.stroke();
    }

    // Изолинии уступов карьера (мягкие светло-серые)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    [
      { cx: 240, cy: 250, rx: 200, ry: 150 },
      { cx: 280, cy: 220, rx: 280, ry: 200 },
      { cx: 320, cy: 190, rx: 360, ry: 250 },
    ].forEach((contour) => {
      ctx.beginPath();
      ctx.ellipse(contour.cx, contour.cy, contour.rx, contour.ry, -0.32, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Основание технологической автодороги
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.stroke();

    // Покрытие полотна дороги
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.stroke();

    // Активная линия маршрута навигатора (Google Blue или Alert Red)
    ctx.strokeStyle = scenario === 'OBSTACLE' ? '#ef4444' : scenario === 'LOW_FUEL' ? '#d97706' : '#2563eb';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.stroke();

    // Точка инцидента (осыпь)
    if (scenario === 'OBSTACLE') {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(180, 300, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Точка заправщика АТЗ
    if (scenario === 'LOW_FUEL') {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(270, 260, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }

    // Контрольные точки навигации
    waypoints.forEach((pt) => {
      const isEndpoint = pt.type === 'loading' || pt.type === 'dump';
      ctx.fillStyle = pt.type === 'loading' ? '#d97706' : pt.type === 'dump' ? '#059669' : pt.type === 'fuel' ? '#d97706' : '#2563eb';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isEndpoint ? 10 : 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Подписи точек
      ctx.save();
      ctx.translate(pt.x, pt.y);
      if (viewMode === 'heading') {
        // Выравниваем текст горизонтально к экрану
        ctx.rotate(truckHeading + Math.PI / 2);
      }
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(pt.label, 14, 4);

      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`+${pt.altitude}м (${pt.sub})`, 14, 17);
      ctx.restore();
    });

    // Встречные самосвалы (CAS)
    nearbyVehicles.forEach((veh) => {
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(veh.x, veh.y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.strokeStyle = 'rgba(2, 132, 199, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(veh.x, veh.y, 30, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.translate(veh.x, veh.y);
      if (viewMode === 'heading') {
        ctx.rotate(truckHeading + Math.PI / 2);
      }
      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillStyle = '#0369a1';
      ctx.fillText(`${veh.code} • ${veh.dist}`, 12, -4);
      ctx.restore();
    });

    // Зона безопасности нашего самосвала
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(curX, curY, 38, 0, Math.PI * 2);
    ctx.stroke();

    // Курсовая стрелка машины
    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(truckHeading);

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-14, -11);
    ctx.lineTo(-7, 0);
    ctx.lineTo(-14, 11);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();

    ctx.restore(); // restore viewport transform

  }, [progress, zoom, scenario, viewMode]);

  const isOverspeed = speed > speedLimit;

  return (
    <div className="w-full h-full min-h-[340px] bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col shadow-sm">
      {/* Верхний баннер Turn-by-Turn подсказок в стиле Google Maps */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-3">
        <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Navigation2 className="w-6 h-6 rotate-45 animate-pulse" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>Через 280 метров</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-normal font-mono">1.2 км до точки</span>
            </div>
            <div className="text-sm font-black text-slate-900">
              {scenario === 'OBSTACLE'
                ? 'Объезд: вираж Сектор-2 &rarr; Трасса #4'
                : scenario === 'LOW_FUEL'
                ? 'Заезд на пункт АТЗ-04 (+1640м)'
                : 'Плавный правый вираж &rarr; Подъем на Отвал (+7%)'}
            </div>
          </div>
        </div>

        {/* Дорожный знак ограничения скорости */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 ${
          isOverspeed ? 'border-red-600 bg-red-50 animate-bounce' : 'border-red-500 bg-white'
        } shadow-md`}>
          <span className={`font-mono font-black text-base ${isOverspeed ? 'text-red-700' : 'text-slate-900'}`}>
            {speedLimit}
          </span>
        </div>
      </div>

      {/* Правый блок управления режимами карты */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {/* Переключатель: Курс по ходу движения (Google Maps) vs Общая карта */}
        <button
          onClick={() => setViewMode(viewMode === 'heading' ? 'overview' : 'heading')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition shadow-md ${
            viewMode === 'heading'
              ? 'bg-blue-600 text-white shadow-blue-500/20'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{viewMode === 'heading' ? '2.5D По курсу' : '2D Обзор карьера'}</span>
        </button>

        <div className="bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-xs font-mono text-emerald-800 font-bold flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>CAS OK (240м)</span>
        </div>
      </div>

      {/* Предупреждение о превышении скорости */}
      {isOverspeed && (
        <div className="absolute bottom-4 left-4 z-10 bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase flex items-center gap-2 shadow-lg animate-pulse">
          <AlertTriangle className="w-4 h-4 text-yellow-300" />
          <span>СНИЗЬТЕ СКОРОСТЬ! ЛИМИТ {speedLimit} КМ/Ч</span>
        </div>
      )}

      {/* Кнопки масштабирования */}
      <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
          className="w-10 h-10 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center transition shadow-md font-bold"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
          className="w-10 h-10 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center transition shadow-md font-bold"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Холст навигации */}
      <canvas
        ref={canvasRef}
        width={760}
        height={480}
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  );
}
