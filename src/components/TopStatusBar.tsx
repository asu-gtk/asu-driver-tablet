import React from 'react';
import { Truck, Radio, Clock, ShieldAlert, Wifi, Bell } from 'lucide-react';

interface TopStatusBarProps {
  truckId: string;
  driverName: string;
  shiftName: string;
  sosActive: boolean;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
  onToggleSos: () => void;
}

export function TopStatusBar({
  truckId,
  driverName,
  shiftName,
  sosActive,
  unreadAlertsCount,
  onOpenNotifications,
  onToggleSos,
}: TopStatusBarProps) {
  return (
    <header className="h-16 bg-white border border-slate-200 rounded-2xl px-6 flex items-center justify-between shadow-sm shrink-0">
      {/* Машина и водитель */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-sm">
          {truckId.replace('TRUCK-', '')}
        </div>
        <div>
          <div className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            БелАЗ-75131 • Борт #{truckId}
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Водитель: {driverName} • {shiftName}
          </div>
        </div>
      </div>

      {/* Центральный статус связи */}
      <div className="flex items-center gap-6 text-xs font-mono">
        <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold">
          <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>GPS FIX: RTK 2.5cm</span>
        </div>

        <div className="flex items-center gap-2 text-blue-800 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 font-semibold">
          <Wifi className="w-4 h-4 text-blue-600" />
          <span>LTE MESH: 98%</span>
        </div>

        <div className="flex items-center gap-2 text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 font-bold text-sm">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>11:45:30</span>
        </div>
      </div>

      {/* Правая панель действий: Центр сообщений + SOS */}
      <div className="flex items-center gap-3">
        {/* Кнопка оповещений / рации */}
        <button
          onClick={onOpenNotifications}
          className="relative px-4 py-2.5 bg-blue-50 hover:bg-blue-100 active:scale-95 border border-blue-200 text-blue-900 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm"
        >
          <Bell className="w-4 h-4 text-blue-600" />
          <span>Оповещения</span>
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] font-black animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* Кнопка SOS / Авария */}
        <button
          onClick={onToggleSos}
          className={`px-5 py-2.5 rounded-xl font-black text-xs tracking-wider uppercase flex items-center gap-2 transition active:scale-95 shadow-sm ${
            sosActive
              ? 'bg-red-600 text-white animate-bounce ring-4 ring-red-400/50'
              : 'bg-red-50 border-2 border-red-300 text-red-700 hover:bg-red-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-600" />
          <span>{sosActive ? 'SOS АКТИВИРОВАН' : 'SOS / АВАРИЯ'}</span>
        </button>
      </div>
    </header>
  );
}
