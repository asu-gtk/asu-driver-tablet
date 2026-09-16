import React from 'react';
import { Truck, Radio, Clock, ShieldAlert, Wifi, BatteryCharging } from 'lucide-react';

interface TopStatusBarProps {
  truckId: string;
  driverName: string;
  shiftName: string;
  sosActive: boolean;
  onToggleSos: () => void;
}

export function TopStatusBar({ truckId, driverName, shiftName, sosActive, onToggleSos }: TopStatusBarProps) {
  return (
    <header className="h-16 bg-[#151b24] border border-[#232c3b] rounded-3xl px-6 flex items-center justify-between shadow-lg shrink-0">
      {/* Машина и водитель */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-md">
          {truckId.replace('TRUCK-', '')}
        </div>
        <div>
          <div className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            БелАЗ-75131 • Борт #{truckId}
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Водитель: {driverName} • {shiftName}
          </div>
        </div>
      </div>

      {/* Центральный статус связи */}
      <div className="flex items-center gap-8 text-xs font-mono text-slate-300">
        <div className="flex items-center gap-2 text-emerald-400 bg-[#0f2e24] px-3 py-1.5 rounded-xl border border-[#1b5e4b]">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>GPS FIX: RTK 2.5cm</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <Wifi className="w-4 h-4 text-cyan-400" />
          <span>LTE Mining MESH</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>11:45:30</span>
        </div>
      </div>

      {/* Кнопка SOS / Авария */}
      <button
        onClick={onToggleSos}
        className={`px-6 py-3 rounded-2xl font-black text-xs tracking-wider uppercase flex items-center gap-2.5 transition active:scale-95 shadow-lg ${
          sosActive
            ? 'bg-red-600 text-white animate-bounce ring-4 ring-red-400/50'
            : 'bg-red-950/40 border-2 border-red-800 text-red-300 hover:bg-red-900/40'
        }`}
      >
        <ShieldAlert className="w-5 h-5 text-red-400" />
        <span>{sosActive ? 'SOS АКТИВИРОВАН' : 'SOS / АВАРИЯ'}</span>
      </button>
    </header>
  );
}
