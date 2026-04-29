import { useState, useCallback } from 'react';
import NeonHeader from './components/NeonHeader';
import BackupTab from './components/BackupTab';
import HistoryTab from './components/HistoryTab';
import ProfilesTab from './components/ProfilesTab';
import { AppTab, BackupEntry, BackupProfile } from './types';
import { loadHistory, loadProfiles, saveHistory, saveProfiles } from './utils/backup';

// Ambient neon orbs background
function NeonOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Cyan orb top-left */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,232,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
      {/* Pink orb bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: '-15%',
        right: '-5%',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,0,222,0.05) 0%, transparent 70%)',
        filter: 'blur(50px)',
      }} />
      {/* Blue orb center */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 800,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(0,120,255,0.03) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />
      {/* Green orb top-right */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(57,255,20,0.04) 0%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
    </div>
  );
}

// Quick-launch profile pills
function QuickLaunchBar({ profiles, onRun }: { profiles: BackupProfile[]; onRun: (p: BackupProfile) => void }) {
  if (profiles.length === 0) return null;
  return (
    <div style={{
      background: 'rgba(0,5,15,0.8)',
      borderBottom: '1px solid rgba(0,255,232,0.08)',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      overflowX: 'auto',
    }}>
      <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '9px', color: 'rgba(0,255,232,0.35)', letterSpacing: '2px', whiteSpace: 'nowrap', flexShrink: 0 }}>
        БЫСТРЫЙ ЗАПУСК:
      </span>
      {profiles.map(p => (
        <button
          key={p.id}
          onClick={() => onRun(p)}
          style={{
            background: 'rgba(0,255,232,0.06)',
            border: '1px solid rgba(0,255,232,0.2)',
            borderRadius: 6,
            padding: '5px 12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: 'all 0.2s ease',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '10px',
            fontWeight: 600,
            color: '#00ffe8',
            letterSpacing: '1px',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(0,255,232,0.12)';
            el.style.borderColor = 'rgba(0,255,232,0.5)';
            el.style.boxShadow = '0 0 10px rgba(0,255,232,0.15)';
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(0,255,232,0.06)';
            el.style.borderColor = 'rgba(0,255,232,0.2)';
            el.style.boxShadow = 'none';
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#00ffe8" stroke="none">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          {p.name}
          {p.lastBackup && (
            <span style={{ color: 'rgba(57,255,20,0.6)', fontSize: '9px' }}>✓</span>
          )}
        </button>
      ))}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('backup');
  const [backupStatus, setBackupStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle');
  const [history, setHistory] = useState<BackupEntry[]>(loadHistory);
  const [profiles, setProfiles] = useState<BackupProfile[]>(loadProfiles);
  const [quickProfile, setQuickProfile] = useState<BackupProfile | null>(null);

  const handleBackupComplete = useCallback((entry: BackupEntry) => {
    setHistory(prev => {
      const next = [entry, ...prev].slice(0, 50);
      saveHistory(next);
      return next;
    });
    // Refresh profiles from storage
    setProfiles(loadProfiles());
  }, []);

  const handleStatusChange = useCallback((s: 'idle' | 'running' | 'done' | 'error') => {
    setBackupStatus(s);
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    saveHistory([]);
  };

  const handleDeleteProfile = (id: string) => {
    const next = profiles.filter(p => p.id !== id);
    setProfiles(next);
    saveProfiles(next);
  };

  const handleQuickLaunch = (profile: BackupProfile) => {
    setQuickProfile(profile);
    setActiveTab('backup');
    setTimeout(() => setQuickProfile(null), 100);
  };

  const handleProfileRunBackup = (profile: BackupProfile) => {
    setQuickProfile(profile);
    setActiveTab('backup');
    setTimeout(() => setQuickProfile(null), 100);
  };

  return (
    <div className="min-h-screen bg-grid" style={{ background: '#050a14', position: 'relative' }}>
      <NeonOrbs />

      {/* Layout */}
      <div className="relative" style={{ zIndex: 1 }}>
        <NeonHeader activeTab={activeTab} onTabChange={setActiveTab} status={backupStatus} />

        {/* Quick launch bar */}
        <QuickLaunchBar profiles={profiles} onRun={handleQuickLaunch} />

        {/* Main content */}
        <main style={{ padding: '32px 24px', minHeight: 'calc(100vh - 120px)' }}>
          {activeTab === 'backup' && (
            <BackupTab
              key={quickProfile?.id ?? 'default'}
              onBackupComplete={handleBackupComplete}
              onStatusChange={handleStatusChange}
              initialProfile={quickProfile}
            />
          )}
          {activeTab === 'history' && (
            <HistoryTab history={history} onClear={handleClearHistory} />
          )}
          {activeTab === 'profiles' && (
            <ProfilesTab
              profiles={profiles}
              onRunBackup={handleProfileRunBackup}
              onDelete={handleDeleteProfile}
            />
          )}
        </main>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(0,255,232,0.08)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0,5,15,0.8)',
        }}>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: 'rgba(0,255,232,0.2)' }}>
            NEONBACKUP © 2025 — Windows Backup Manager
          </span>
          <div className="flex items-center gap-2">
            <div className={`status-dot ${backupStatus === 'running' ? 'running' : backupStatus === 'error' ? 'error' : 'idle'}`} style={{ width: 6, height: 6 }} />
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: 'rgba(0,255,232,0.25)' }}>
              Профилей: {profiles.length} · Бэкапов: {history.length}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
