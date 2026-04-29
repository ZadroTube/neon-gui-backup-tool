import { BackupProfile } from '../types';
import { formatDisplayDate } from '../utils/backup';

interface Props {
  profiles: BackupProfile[];
  onRunBackup: (profile: BackupProfile) => void;
  onDelete: (id: string) => void;
}

export default function ProfilesTab({ profiles, onRunBackup, onDelete }: Props) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-6">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(0,255,232,0.15)" strokeWidth="1">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
        <div className="text-center">
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', color: 'rgba(0,255,232,0.3)', letterSpacing: '3px' }}>
            НЕТ ПРОФИЛЕЙ
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '12px', color: 'rgba(0,255,232,0.2)', marginTop: 8 }}>
            Настройте бэкап и нажмите «Сохранить профиль»
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto">
      <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', color: 'rgba(0,255,232,0.5)', letterSpacing: '3px' }}>
        ПРОФИЛЕЙ: {profiles.length}
      </div>

      {profiles.map(profile => (
        <div key={profile.id} className="backup-card rounded-lg p-5">
          <div className="flex items-start justify-between gap-4">
            {/* Left: info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00ffe8" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px #00ffe8)', flexShrink: 0 }}>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                </svg>
                <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '14px', fontWeight: 700, color: '#00ffe8' }}>
                  {profile.name}
                </span>
                {profile.backupCount > 0 && (
                  <span style={{
                    background: 'rgba(0,255,232,0.1)',
                    border: '1px solid rgba(0,255,232,0.3)',
                    borderRadius: 4,
                    padding: '1px 6px',
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: '10px',
                    color: '#00ffe8',
                  }}>
                    ×{profile.backupCount}
                  </span>
                )}
              </div>

              {/* Sources */}
              <div className="mb-2">
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(0,255,232,0.4)', letterSpacing: '1.5px', marginBottom: 4 }}>ИСТОЧНИКИ</div>
                {profile.sourcePaths.slice(0, 3).map((p, i) => (
                  <div key={i} style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: 'rgba(0,255,232,0.65)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    → {p}
                  </div>
                ))}
                {profile.sourcePaths.length > 3 && (
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: 'rgba(0,255,232,0.35)' }}>
                    + ещё {profile.sourcePaths.length - 3} папок...
                  </div>
                )}
              </div>

              {/* Destination */}
              <div className="mb-3">
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(255,0,222,0.4)', letterSpacing: '1.5px', marginBottom: 4 }}>НАЗНАЧЕНИЕ</div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: 'rgba(255,0,222,0.65)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  ← {profile.destinationPath}
                </div>
              </div>

              {/* Meta */}
              <div className="flex gap-4 flex-wrap">
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: 'rgba(0,255,232,0.3)' }}>
                  Создан: {formatDisplayDate(profile.createdAt)}
                </div>
                {profile.lastBackup && (
                  <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: 'rgba(57,255,20,0.5)' }}>
                    Последний: {formatDisplayDate(profile.lastBackup)}
                  </div>
                )}
              </div>
            </div>

            {/* Right: action buttons */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              <button
                className="btn-neon-green rounded"
                style={{ padding: '10px 16px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                onClick={() => onRunBackup(profile)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                ЗАПУСТИТЬ
              </button>
              <button
                className="btn-neon-pink rounded"
                style={{ padding: '8px 16px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                onClick={() => onDelete(profile.id)}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                </svg>
                УДАЛИТЬ
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
