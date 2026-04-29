import { useEffect, useRef } from 'react';

interface Props {
  progress: number; // 0-100
  log: string[];
  status: 'idle' | 'running' | 'done' | 'error';
}

export default function BackupProgress({ progress, log, status }: Props) {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const statusColor = status === 'error' ? '#ff2d2d'
    : status === 'done' ? '#39ff14'
    : '#00ffe8';

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(0,255,232,0.5)', letterSpacing: '2px' }}>
            ПРОГРЕСС
          </span>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '14px', color: statusColor, textShadow: `0 0 8px ${statusColor}` }}>
            {progress}%
          </span>
        </div>
        <div className="progress-bar rounded" style={{ height: 8 }}>
          <div
            className="progress-fill rounded"
            style={{
              width: `${progress}%`,
              background: status === 'error'
                ? 'linear-gradient(90deg, #ff2d2d, #ff6b6b)'
                : status === 'done'
                ? 'linear-gradient(90deg, #39ff14, #00ff88, #39ff14)'
                : 'linear-gradient(90deg, #00ffe8, #00a8ff, #00ffe8)',
              boxShadow: `0 0 10px ${statusColor}80, 0 0 20px ${statusColor}40`,
            }}
          />
        </div>
      </div>

      {/* Log */}
      <div
        ref={logRef}
        className="log-area rounded"
        style={{ height: 160, padding: '10px 12px', overflowY: 'auto' }}
      >
        {log.length === 0 ? (
          <div style={{ color: 'rgba(0,255,232,0.2)', fontFamily: 'Share Tech Mono, monospace', fontSize: '11px' }}>
            // Ожидание запуска бэкапа...
          </div>
        ) : (
          log.map((line, i) => {
            const isSuccess = line.includes('✅') || line.includes('✓');
            const isError = line.includes('❌') || line.includes('ОШИБКА');
            const isProgress = line.includes('██');
            const color = isSuccess ? '#39ff14'
              : isError ? '#ff2d2d'
              : isProgress ? '#00a8ff'
              : 'rgba(0,255,232,0.7)';
            return (
              <div key={i} style={{ color, marginBottom: 2, fontSize: '11px', fontFamily: 'Share Tech Mono, monospace', lineHeight: 1.5 }}>
                {line}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
