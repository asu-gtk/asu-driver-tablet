import React, { useRef, useEffect, useState } from 'react';
import { Compass, Navigation2, ShieldCheck, ZoomIn, ZoomOut, AlertTriangle, Fuel, Construction } from 'lucide-react';
import { ScenarioType } from './PredictiveAdvisorCard';

interface Waypoint {
  x: number;
  y: number;
  label: string;
  sub: string;
  type: 'loading' | 'dump' | 'turn' | 'fork' | 'fuel' | 'obstacle';
  altitude: number;
}

export function NavigationMap({ speed, scenario }: { speed: number; scenario: ScenarioType }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [progress, setProgress] = useState(0.28);
  const [zoom, setZoom] = useState(1);

  // Штатные контрольные точки трассы карьера
  const standardWaypoints: Waypoint[] = [
    { x: 90, y: 340, label: 'ЭКГ-5А #2', sub: 'Забой +1620', type: 'loading', altitude: 1620 },
    { x: 170, y: 270, label: 'Вираж Юг', sub: 'R=40м', type: 'turn', altitude: 1630 },
    { x: 290, y: 220, label: 'Разъезд #3', sub: 'Двухполосный', type: 'fork', altitude: 1648 },
    { x: 410, y: 130, label: 'Трасса Восток', sub: 'Уклон +7%', type: 'turn', altitude: 1665 },
    { x: 540, y: 70, label: 'Отвал Восток', sub: 'Приемный бункер', type: 'dump', altitude: 1680 },
  ];

  // Трасса в объезд при осыпи скалы (OBSTACLE)
  const detourWaypoints: Waypoint[] = [
    { x: 90, y: 340, label: 'ЭКГ-5А #2', sub: 'Забой +1620', type: 'loading', altitude: 1620 },
    { x: 140, y: 310, label: 'Съезд на объезд', sub: 'ПК-12', type: 'fork', altitude: 1625 },
    { x: 230, y: 330, label: 'Тех. вираж Сектор-2', sub: 'Объезд осыпи (+350м)', type: 'turn', altitude: 1635 },
    { x: 340, y: 250, label: 'Выезд на Трассу #4', sub: 'Безопасный участок', type: 'fork', altitude: 1650 },
    { x: 410, y: 130, label: 'Трасса Восток', sub: 'Уклон +7%', type: 'turn', altitude: 1665 },
    { x: 540, y: 70, label: 'Отвал Восток', sub: 'Приемный бункер', type: 'dump', altitude: 1680 },
  ];

  // Маршрут через АТЗ-04 при низком топливе (LOW_FUEL)
  const fuelWaypoints: Waypoint[] = [
    { x: 90, y: 340, label: 'ЭКГ-5А #2', sub: 'Забой +1620', type: 'loading', altitude: 1620 },
    { x: 170, y: 270, label: 'Вираж Юг', sub: 'R=40м', type: 'turn', altitude: 1630 },
    { x: 250, y: 240, label: 'Заправщик АТЗ-04', sub: 'Горизонт +1640', type: 'fuel', altitude: 1640 },
    { x: 410, y: 130, label: 'Трасса Восток', sub: 'Уклон +7%', type: 'turn', altitude: 1665 },
    { x: 540, y: 70, label: 'Отвал Восток', sub: 'Приемный бункер', type: 'dump', altitude: 1680 },
  ];

  const waypoints = scenario === 'OBSTACLE' ? detourWaypoints : scenario === 'LOW_FUEL' ? fuelWaypoints : standardWaypoints;

  const nearbyVehicles = [
    { x: 330, y: 195, code: 'БелАЗ-104', status: 'Встречный', dist: '240 м' },
    { x: 130, y: 300, code: 'БелАЗ-108', status: 'В забое', dist: '620 м' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => (p >= 0.99 ? 0.02 : p + 0.0025));
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

    // Светлый чистый фон дневной навигации
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Координатная сетка
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Изолинии уступов карьера (мягкие светло-серые)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    [
      { cx: 220, cy: 230, rx: 190, ry: 140 },
      { cx: 260, cy: 200, rx: 260, ry: 190 },
      { cx: 300, cy: 170, rx: 330, ry: 240 },
    ].forEach((contour) => {
      ctx.beginPath();
      ctx.ellipse(contour.cx, contour.cy, contour.rx, contour.ry, -0.32, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // Основание технологической дороги
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 28;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.stroke();

    // Покрытие полотна дороги (светлый асфальт/грейдер)
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 22;
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.stroke();

    // Активная линия маршрута навигатора
    ctx.strokeStyle = scenario === 'OBSTACLE' ? '#ef4444' : scenario === 'LOW_FUEL' ? '#f59e0b' : '#2563eb';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(waypoints[0].x, waypoints[0].y);
    for (let i = 1; i < waypoints.length; i++) {
      ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.stroke();

    // Если есть осыпь (OBSTACLE)
    if (scenario === 'OBSTACLE') {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(170, 270, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('⚠ ЗАТОР / ОСЫПЬ (ПК-18)', 190, 274);
    }

    // Если заправка (LOW_FUEL)
    if (scenario === 'LOW_FUEL') {
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(250, 240, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Контрольные точки навигации
    waypoints.forEach((pt) => {
      const isEndpoint = pt.type === 'loading' || pt.type === 'dump';
      ctx.fillStyle = pt.type === 'loading' ? '#d97706' : pt.type === 'dump' ? '#059669' : pt.type === 'fuel' ? '#d97706' : '#2563eb';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, isEndpoint ? 9 : 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Подписи точек (контрастный темный текст)
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(pt.label, pt.x + 12, pt.y + 3);

      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`+${pt.altitude}м (${pt.sub})`, pt.x + 12, pt.y + 16);
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
      ctx.arc(veh.x, veh.y, 28, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = 'bold 10px JetBrains Mono, monospace';
      ctx.fillStyle = '#0369a1';
      ctx.fillText(`${veh.code} • ${veh.dist}`, veh.x + 10, veh.y - 6);
    });

    // Расчет текущей позиции самосвала
    const totalSegments = waypoints.length - 1;
    const curIdx = Math.min(totalSegments - 1, Math.floor(progress * totalSegments));
    const subProg = (progress * totalSegments) - curIdx;

    const p1 = waypoints[curIdx];
    const p2 = waypoints[curIdx + 1];

    const curX = p1.x + (p2.x - p1.x) * subProg;
    const curY = p1.y + (p2.y - p1.y) * subProg;
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

    // Радарная зона безопасности
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(curX, curY, 36, 0, Math.PI * 2);
    ctx.stroke();

    // Курсовая стрелка машины
    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(angle);

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.moveTo(18, 0);
    ctx.lineTo(-12, -10);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-12, 10);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();

    // Лейбл машины
    ctx.font = 'bold 12px JetBrains Mono, monospace';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('ВЫ (БОРТ #101)', curX - 44, curY - 22);

  }, [progress, zoom, scenario]);

  return (
    <div className="w-full h-full min-h-[340px] bg-slate-50 rounded-2xl border border-slate-200 relative overflow-hidden flex flex-col shadow-sm">
      {/* Верхний баннер навигационных указаний */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3">
        <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-md">
          <Navigation2 className="w-6 h-6 text-blue-600 rotate-45 animate-pulse" />
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {scenario === 'OBSTACLE' ? 'ОБЪЕЗД ОПАСНОГО УЧАСТКА' : scenario === 'LOW_FUEL' ? 'МАРШРУТ С ЗАЕЗДОМ НА АЗС' : 'СЛЕДУЮЩИЙ МАНЕВР • ЧЕРЕЗ 280 М'}
            </div>
            <div className="text-base font-extrabold text-slate-900">
              {scenario === 'OBSTACLE'
                ? 'Вираж Сектор-2 (+350м) &rarr; Выезд на Трассу #4'
                : scenario === 'LOW_FUEL'
                ? 'Пункт заправки АТЗ-04 (+1640м)'
                : 'Плавный правый вираж &rarr; Подъем на Отвал (+7%)'}
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-xs font-mono text-emerald-800 font-bold flex items-center gap-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>CAS: ДИСТАНЦИЯ БЕЗОПАСНА</span>
        </div>
      </div>

      {/* Зум */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
          className="w-11 h-11 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center transition shadow-md font-bold"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
          className="w-11 h-11 bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border border-slate-200 rounded-xl flex items-center justify-center transition shadow-md font-bold"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
      </div>

      {/* Канвас навигации */}
      <canvas
        ref={canvasRef}
        width={760}
        height={480}
        className="w-full h-full object-cover rounded-2xl"
      />
    </div>
  );
}
