import React, { useState } from 'react';
import {
  Bell,
  Send,
  AlertTriangle,
  Flame,
  Wrench,
  Construction,
  ShieldAlert,
  CheckCircle2,
  Clock,
  X,
  Radio
} from 'lucide-react';

export interface DispatcherMessage {
  id: string;
  time: string;
  type: 'urgent' | 'info' | 'blast';
  title: string;
  body: string;
  acknowledged: boolean;
}

interface NotificationCenterProps {
  messages: DispatcherMessage[];
  onAcknowledge: (id: string) => void;
  onSendReport: (reportType: string, note: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationCenter({
  messages,
  onAcknowledge,
  onSendReport,
  isOpen,
  onClose,
}: NotificationCenterProps) {
  const [reportType, setReportType] = useState<string>('ROAD_OBSTACLE');
  const [reportNote, setReportNote] = useState('');
  const [activeTab, setActiveTab] = useState<'inbox' | 'send'>('inbox');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = () => {
    onSendReport(reportType, reportNote);
    setReportNote('');
    setSuccessToast('Доклад с текущими координатами GPS передан диспетчеру');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const unreadCount = messages.filter((m) => !m.acknowledged).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scale-up">
        {/* Шапка модального центра сообщений */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Бортовой центр оповещений</h2>
              <p className="text-xs text-slate-500">Связь водителя с диспетчерским центром карьера</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Вкладки: Входящие / Отправить доклад */}
            <div className="flex bg-slate-200 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('inbox')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'inbox' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Входящие ({unreadCount})
              </button>
              <button
                onClick={() => setActiveTab('send')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  activeTab === 'send' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Отправить доклад
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Уведомление об успешной отправке */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Тело: Входящие распоряжения */}
        {activeTab === 'inbox' ? (
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">Новых распоряжений нет</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border transition ${
                    !msg.acknowledged
                      ? msg.type === 'blast'
                        ? 'bg-red-50 border-red-300 ring-2 ring-red-400/30'
                        : 'bg-blue-50 border-blue-200'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {msg.type === 'blast' && (
                        <span className="px-2.5 py-0.5 bg-red-600 text-white rounded-full text-[10px] font-black tracking-wider uppercase">
                          ВЗРЫВНЫЕ РАБОТЫ (БВР)
                        </span>
                      )}
                      {msg.type === 'urgent' && (
                        <span className="px-2.5 py-0.5 bg-amber-600 text-white rounded-full text-[10px] font-black tracking-wider uppercase">
                          СРОЧНО
                        </span>
                      )}
                      {msg.type === 'info' && (
                        <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-black tracking-wider uppercase">
                          ИНФОРМАЦИЯ
                        </span>
                      )}
                      <span className="text-xs font-bold text-slate-900">{msg.title}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {msg.time}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-3">{msg.body}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {msg.acknowledged ? '✓ Подтверждено водителем' : 'Требуется подтверждение'}
                    </span>

                    {!msg.acknowledged ? (
                      <button
                        onClick={() => onAcknowledge(msg.id)}
                        className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm"
                      >
                        ПОДТВЕРДИТЬ ОЗНАКОМЛЕНИЕ
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Принято в работу
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Тело: Отправка оперативного доклада диспетчеру */
          <div className="p-4 flex-1 overflow-y-auto space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Выберите тип события на трассе / в забое:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'ROAD_OBSTACLE', label: 'Осыпь / Помеха на дороге', icon: <Construction className="w-4 h-4 text-red-600" /> },
                  { id: 'POOR_VISIBILITY', label: 'Пыль / Туман / Скользко', icon: <AlertTriangle className="w-4 h-4 text-amber-600" /> },
                  { id: 'MECHANICAL_FAULT', label: 'Неисправность узла / ТО', icon: <Wrench className="w-4 h-4 text-blue-600" /> },
                  { id: 'FUEL_REQUEST', label: 'Вызов мобильного АТЗ', icon: <Flame className="w-4 h-4 text-amber-600" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setReportType(item.id)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition ${
                      reportType === item.id
                        ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-sm ring-2 ring-blue-400/30'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {item.icon}
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                Дополнительный комментарий (опционально):
              </label>
              <textarea
                value={reportNote}
                onChange={(e) => setReportNote(e.target.value)}
                placeholder="Укажите ориентир, пикет или подробности (например: осыпь на ПК-18 после поворота)..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
            </div>

            <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs text-slate-600 font-mono">
              <span className="flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-600" />
                GPS-привязка: 42.8746, 74.5698 (Горизонт +1620)
              </span>
              <span>Борт #101</span>
            </div>

            <button
              onClick={handleSend}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-98 text-white rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition"
            >
              <Send className="w-4 h-4" />
              <span>ОТПРАВИТЬ ДОКЛАД ДИСПЕТЧЕРУ</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
