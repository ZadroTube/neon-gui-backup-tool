import React from 'react';
import { AppTab } from '../types';

interface Props {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  status: 'idle' | 'running' | 'done' | 'error';
}

const tabs: { id: AppTab; label: string }[] = [
  { id: 'backup', label: 'Бэкап' },
  { id: 'history', label: 'История' },
  { id: 'profiles', label: 'Профили' },
];

const statusLabels: Record<string, string> = {
  idle: 'ГОТОВ',
  running: 'ВЫПОЛНЯЕТСЯ',
  done: 'ЗАВЕРШЕНО',
  error: 'ОШИБКА',
};

export default function NeonHeader({ activeTab, onTabChange, status }: Props) {
  const [time, setTime] = React.useState(new Date());

  React.useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const timeStr = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr = `${pad(time.getDate())}.${pad(time.getMonth() + 1)}.${time.getFullYear()}`;

  return (
    <header className="relative z-10 border-b border-cyan-400/20" style={{ background: 'rgba(0,5,15,0.9)', backdropFilter: 'blur(10px)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-cyan-400/10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-8 h-8 spin-slow" style={{ filter: 'drop-shadow(0 0 6px #00ffe8)' }}>
              <polygon points="16,2 30,9 30,23 16,30 2,23 2,9" fill="none" stroke="#00ffe8" strokeWidth="1.5" />
              <polygon points="16,8 24,12 24,20 16,24 8,20 8,12" fill="rgba(0,255,232,0.1)" stroke="#00ffe8" strokeWidth="1" />
              <circle cx="16" cy="16" r="3" fill="#00ffe8" style={{ filter: 'blur(1px)' }} />
            </svg>
          </div>
          <div>
            <div className="glitch" style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '18px',
              fontWeight: 900,
              color: '#00ffe8',
              textShadow: '0 0 10px #00ffe8, 0 0 20px #00ffe8',
              letterSpacing: '4px',
            }}>
              NEON<span style={{ color: '#ff00de', textShadow: '0 0 10px #ff00de' }}>BACKUP</span>
            </div>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '9px',
              color: 'rgba(0,255,232,0.4)',
              letterSpacing: '3px',
            }}>
              WINDOWS BACKUP MANAGER v2.0
            </div>
          </div>
        </div>

        {/* Status + Clock */}
        <div className="flex items-center gap-6">
          {/* Status */}
          <div className="flex items-center gap-2">
            <div className={`status-dot ${status}`} />
            <span style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '2px',
              color: status === 'running' ? '#39ff14'
                : status === 'error' ? '#ff2d2d'
                : status === 'done' ? '#39ff14'
                : 'rgba(0,255,232,0.6)',
            }}>
              {statusLabels[status]}
            </span>
          </div>

          {/* Clock */}
          <div className="text-right">
            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '20px',
              color: '#00ffe8',
              textShadow: '0 0 10px rgba(0,255,232,0.5)',
              lineHeight: 1,
            }}>
              {timeStr}
            </div>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: '10px',
              color: 'rgba(0,255,232,0.4)',
            }}>
              {dateStr}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex px-6 gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
}
