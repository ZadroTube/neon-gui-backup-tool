import { useState, useRef, useCallback } from 'react';
import PathInput from './PathInput';
import SourceFolderList from './SourceFolderList';
import BackupProgress from './BackupProgress';
import { BackupEntry, BackupProfile } from '../types';
import {
  generateId,
  getBackupFolderName,
  generateBackupLog,
  simulateFileCount,
  simulateRandomSize,
  saveHistory,
  loadProfiles,
  saveProfiles,
} from '../utils/backup';

interface Props {
  onBackupComplete: (entry: BackupEntry) => void;
  onStatusChange: (status: 'idle' | 'running' | 'done' | 'error') => void;
  initialProfile?: BackupProfile | null;
}

export default function BackupTab({ onBackupComplete, onStatusChange, initialProfile }: Props) {
  const [profileName, setProfileName] = useState(initialProfile?.name ?? 'Мой бэкап');
  const [sourceFolders, setSourceFolders] = useState<string[]>(initialProfile?.sourcePaths ?? []);
  const [destFolder, setDestFolder] = useState(initialProfile?.destinationPath ?? '');
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState<string[]>([]);
  const [lastEntry, setLastEntry] = useState<BackupEntry | null>(null);
  const intervalRef = useRef<number | null>(null);

  const setStatusBoth = (s: 'idle' | 'running' | 'done' | 'error') => {
    setStatus(s);
    onStatusChange(s);
  };

  const runBackup = useCallback(async () => {
    if (sourceFolders.length === 0 || !destFolder.trim()) return;
    if (status === 'running') return;

    setStatusBoth('running');
    setProgress(0);
    setLog([]);
    setLastEntry(null);

    const startTime = Date.now();
    const filesCount = simulateFileCount();
    const size = simulateRandomSize();
    const date = new Date();
    const folderName = getBackupFolderName(profileName, date);
    const logLines = generateBackupLog(sourceFolders, destFolder, folderName, filesCount, size);

    // Animate progress + log
    let step = 0;
    const totalSteps = 60;


    await new Promise<void>((resolve) => {
      intervalRef.current = window.setInterval(() => {
        step++;
        const pct = Math.min(Math.round((step / totalSteps) * 100), 100);
        setProgress(pct);

        const upToLine = Math.min(Math.floor(step * (logLines.length / totalSteps)) + 1, logLines.length);
        setLog(logLines.slice(0, upToLine));

        if (step >= totalSteps) {
          clearInterval(intervalRef.current!);
          resolve();
        }
      }, 50);
    });

    const duration = Math.round((Date.now() - startTime) / 1000);

    const entry: BackupEntry = {
      id: generateId(),
      name: profileName,
      sourcePaths: [...sourceFolders],
      destinationPath: destFolder,
      timestamp: date,
      status: 'success',
      size,
      filesCount,
      duration,
      log: logLines,
    };

    setLastEntry(entry);
    setStatusBoth('done');
    onBackupComplete(entry);

    // Update profile if exists
    const profiles = loadProfiles();
    const pidx = profiles.findIndex(p => p.name === profileName);
    if (pidx >= 0) {
      profiles[pidx].lastBackup = date;
      profiles[pidx].backupCount += 1;
      saveProfiles(profiles);
    }

    // Save to history
    const hist = JSON.parse(localStorage.getItem('neonbackup_history') || '[]');
    hist.unshift(entry);
    saveHistory(hist.slice(0, 50));
  }, [sourceFolders, destFolder, profileName, status]);

  const saveAsProfile = () => {
    if (!profileName.trim() || sourceFolders.length === 0 || !destFolder.trim()) return;
    const profiles = loadProfiles();
    const exists = profiles.findIndex(p => p.name === profileName);
    if (exists >= 0) {
      profiles[exists].sourcePaths = [...sourceFolders];
      profiles[exists].destinationPath = destFolder;
    } else {
      profiles.unshift({
        id: generateId(),
        name: profileName,
        sourcePaths: [...sourceFolders],
        destinationPath: destFolder,
        createdAt: new Date(),
        lastBackup: null,
        backupCount: 0,
      });
    }
    saveProfiles(profiles);
    alert('Профиль сохранён!');
  };

  const reset = () => {
    setStatusBoth('idle');
    setProgress(0);
    setLog([]);
    setLastEntry(null);
  };

  const canBackup = sourceFolders.length > 0 && destFolder.trim().length > 0 && status !== 'running';

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
      {/* Profile name */}
      <div className="neon-box-cyan rounded-lg p-5 relative scan-line" style={{ position: 'relative' }}>
        {/* Section header */}
        <div className="flex items-center gap-2 mb-4">
          <div style={{ width: 3, height: 18, background: '#00ffe8', boxShadow: '0 0 8px #00ffe8', borderRadius: 2 }} />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#00ffe8', letterSpacing: '3px' }}>
            ИМЯ ПРОФИЛЯ
          </span>
        </div>
        <div className="relative flex-1">
          <div className="absolute top-0 left-0 w-3 h-3 pointer-events-none" style={{ zIndex: 1 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 10, height: 2, background: '#00ffe8', boxShadow: '0 0 6px #00ffe8' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 10, background: '#00ffe8', boxShadow: '0 0 6px #00ffe8' }} />
          </div>
          <input
            type="text"
            className="neon-input w-full rounded"
            value={profileName}
            onChange={e => setProfileName(e.target.value)}
            placeholder="Название резервной копии"
            style={{ padding: '10px 14px', fontSize: '14px' }}
          />
        </div>
      </div>

      {/* Source folders */}
      <div className="neon-box-cyan rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div style={{ width: 3, height: 18, background: '#00ffe8', boxShadow: '0 0 8px #00ffe8', borderRadius: 2 }} />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#00ffe8', letterSpacing: '3px' }}>
            ОТКУДА КОПИРОВАТЬ
          </span>
        </div>
        <SourceFolderList
          folders={sourceFolders}
          onAdd={path => setSourceFolders(prev => [...prev, path])}
          onRemove={i => setSourceFolders(prev => prev.filter((_, idx) => idx !== i))}
        />
      </div>

      {/* Destination */}
      <div className="neon-box-pink rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <div style={{ width: 3, height: 18, background: '#ff00de', boxShadow: '0 0 8px #ff00de', borderRadius: 2 }} />
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: '#ff00de', letterSpacing: '3px' }}>
            КУДА СОХРАНЯТЬ
          </span>
        </div>
        <PathInput
          label="Папка назначения"
          value={destFolder}
          onChange={setDestFolder}
          placeholder="D:\Backups"
          accentColor="pink"
          hint="Резервные копии будут сохраняться с меткой времени: папка_backup_ГГГГ-ММ-ДД_ЧЧ-ММ-СС"
          icon={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              <polyline points="12 12 12 18" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
          }
        />
      </div>

      {/* Progress */}
      {(status !== 'idle' || log.length > 0) && (
        <div className="neon-box-cyan rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <div style={{ width: 3, height: 18, background: status === 'done' ? '#39ff14' : status === 'error' ? '#ff2d2d' : '#00ffe8', boxShadow: `0 0 8px ${status === 'done' ? '#39ff14' : status === 'error' ? '#ff2d2d' : '#00ffe8'}`, borderRadius: 2 }} />
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '11px', fontWeight: 700, color: status === 'done' ? '#39ff14' : status === 'error' ? '#ff2d2d' : '#00ffe8', letterSpacing: '3px' }}>
              {status === 'running' ? 'ВЫПОЛНЯЕТСЯ...' : status === 'done' ? 'ЗАВЕРШЕНО' : 'ЛОГ'}
            </span>
            {status === 'running' && (
              <div className="pulse-neon" style={{ width: 8, height: 8, background: '#00ffe8', borderRadius: '50%', boxShadow: '0 0 8px #00ffe8', marginLeft: 4 }} />
            )}
          </div>
          <BackupProgress progress={progress} log={log} status={status} />

          {status === 'done' && lastEntry && (
            <div className="mt-4 p-3 rounded" style={{ background: 'rgba(57,255,20,0.05)', border: '1px solid rgba(57,255,20,0.2)' }}>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'ФАЙЛОВ', value: lastEntry.filesCount.toLocaleString() },
                  { label: 'РАЗМЕР', value: lastEntry.size },
                  { label: 'ВРЕМЯ', value: `${lastEntry.duration}с` },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '18px', fontWeight: 700, color: '#39ff14', textShadow: '0 0 10px #39ff14' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(57,255,20,0.5)', letterSpacing: '2px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-center" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '11px', color: 'rgba(57,255,20,0.6)' }}>
                Сохранено: {lastEntry.destinationPath}\{getBackupFolderName(lastEntry.name, lastEntry.timestamp)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        {/* MAIN BACKUP BUTTON */}
        <button
          className="btn-neon-green rounded-lg w-full"
          style={{
            padding: '18px',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
          onClick={runBackup}
          disabled={!canBackup}
        >
          {status === 'running' ? (
            <>
              <svg className="spin-slow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              СОЗДАНИЕ БЭКАПА...
            </>
          ) : status === 'done' ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              БЭКАП СОЗДАН — ПОВТОРИТЬ
            </>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              СОЗДАТЬ РЕЗЕРВНУЮ КОПИЮ
            </>
          )}
        </button>

        {/* Secondary buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="btn-neon-cyan rounded-lg"
            style={{ padding: '12px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={saveAsProfile}
            disabled={!profileName.trim() || sourceFolders.length === 0 || !destFolder.trim()}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            СОХРАНИТЬ ПРОФИЛЬ
          </button>
          <button
            className="btn-neon-pink rounded-lg"
            style={{ padding: '12px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={reset}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
            </svg>
            СБРОС
          </button>
        </div>
      </div>
    </div>
  );
}
