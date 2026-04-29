import { useState } from 'react';
import { BackupEntry } from '../types';
import { formatDisplayDate, formatDuration } from '../utils/backup';

interface Props {
  history: BackupEntry[];
  onClear: () => void;
}

export default function HistoryTab({ history, onClear }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(0,255,232,0.15)" strokeWidth="1">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <div className="text-center">
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', color: 'rgba(0,255,232,0.3)', letterSpacing: '3px' }}>
            ИСТОРИЯ ПУСТА
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '12px', color: 'rgba(0,255,232,0.2)', marginTop: 8 }}>
            Создайте первый бэкап во вкладке «Бэкап»
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: 'rgba(0,255,232,0.5)', letterSpacing: '3px' }}>
          ЗАПИСЕЙ: {history.length}
        </div>
        <button
          className="btn-neon-pink rounded"
          style={{ padding: '6px 14px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: 6 }}
          onClick={onClear}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
          ОЧИСТИТЬ
        </button>
      </div>

      {/* Entries */}
      {history.map(entry => (
        <div key={entry.id} className="backup-card rounded-lg overflow-hidden">
          {/* Card header */}
          <div
            className="flex items-center justify-between px-5 py-4 cursor-pointer"
            onClick={() => setExpanded(expanded === entry.id ? null : entry.id)}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Status icon */}
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: entry.status === 'success' ? 'rgba(57,255,20,0.1)' : 'rgba(255,45,45,0.1)',
                border: `1px solid ${entry.status === 'success' ? 'rgba(57,255,20,0.4)' : 'rgba(255,45,45,0.4)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {entry.status === 'success' ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#39ff14" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff2d2d" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                )}
              </div>

              {/* Info */}
              <div className="min-w-0">
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '13px', fontWeight: 600, color: '#00ffe8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {entry.name}
                </div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: 'rgba(0,255,232,0.4)', marginTop: 2 }}>
                  {formatDisplayDate(entry.timestamp)}
                </div>
              </div>
            </div>

            {/* Stats + expand */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="hidden sm:flex gap-4">
                <div className="text-center">
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '13px', color: '#00ffe8' }}>{entry.size}</div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: 'rgba(0,255,232,0.35)', letterSpacing: '1px' }}>РАЗМЕР</div>
                </div>
                <div className="text-center">
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '13px', color: '#00ffe8' }}>{entry.filesCount.toLocaleString()}</div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: 'rgba(0,255,232,0.35)', letterSpacing: '1px' }}>ФАЙЛОВ</div>
                </div>
                <div className="text-center">
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '13px', color: '#00ffe8' }}>{formatDuration(entry.duration)}</div>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '8px', color: 'rgba(0,255,232,0.35)', letterSpacing: '1px' }}>ВРЕМЯ</div>
                </div>
              </div>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,255,232,0.4)" strokeWidth="2"
                style={{ transform: expanded === entry.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0 }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Expanded details */}
          {expanded === entry.id && (
            <div className="px-5 pb-4 border-t border-cyan-400/10">
              {/* Sources */}
              <div className="mt-3 mb-2">
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(0,255,232,0.4)', letterSpacing: '2px', marginBottom: 6 }}>
                  ИСХОДНЫЕ ПАПКИ
                </div>
                {entry.sourcePaths.map((p, i) => (
                  <div key={i} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: 'rgba(0,255,232,0.7)', marginBottom: 3 }}>
                    → {p}
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(255,0,222,0.4)', letterSpacing: '2px', marginBottom: 4 }}>
                  ПАПКА НАЗНАЧЕНИЯ
                </div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: 'rgba(255,0,222,0.7)' }}>
                  ← {entry.destinationPath}
                </div>
              </div>
              {/* Log */}
              <div className="log-area rounded" style={{ maxHeight: 120, padding: '8px 10px', overflowY: 'auto' }}>
                {entry.log.map((line, i) => (
                  <div key={i} style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: '10px',
                    color: line.includes('✅') || line.includes('✓') ? '#39ff14'
                      : line.includes('❌') ? '#ff2d2d'
                      : 'rgba(0,255,232,0.5)',
                    lineHeight: 1.6,
                  }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
