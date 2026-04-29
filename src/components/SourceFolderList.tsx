import React, { useState } from 'react';

interface Props {
  folders: string[];
  onAdd: (path: string) => void;
  onRemove: (index: number) => void;
}

export default function SourceFolderList({ folders, onAdd, onRemove }: Props) {
  const [inputVal, setInputVal] = useState('');

  const handleAdd = () => {
    const trimmed = inputVal.trim();
    if (trimmed && !folders.includes(trimmed)) {
      onAdd(trimmed);
      setInputVal('');
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00ffe8" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 4px #00ffe8)', flexShrink: 0 }}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <label style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '10px',
          fontWeight: 600,
          color: 'rgba(0,255,232,0.7)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Исходные папки ({folders.length})
        </label>
      </div>

      {/* Added folders */}
      {folders.length > 0 && (
        <div className="flex flex-col gap-1 mb-3">
          {folders.map((f, i) => (
            <div
              key={i}
              className="folder-tag flex items-center justify-between rounded px-3 py-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="rgba(0,255,232,0.5)" stroke="none">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
                <span style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: '12px',
                  color: '#00ffe8',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  maxWidth: '100%',
                }}>
                  {f}
                </span>
              </div>
              <button
                onClick={() => onRemove(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'rgba(255,45,45,0.7)',
                  padding: '2px',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = '#ff2d2d';
                  (e.currentTarget as HTMLElement).style.textShadow = '0 0 8px #ff2d2d';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,45,45,0.7)';
                  (e.currentTarget as HTMLElement).style.textShadow = 'none';
                }}
                title="Удалить"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute top-0 left-0 w-3 h-3 pointer-events-none" style={{ zIndex: 1 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 10, height: 2, background: '#00ffe8', boxShadow: '0 0 6px #00ffe8' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 10, background: '#00ffe8', boxShadow: '0 0 6px #00ffe8' }} />
          </div>
          <input
            type="text"
            className="neon-input w-full rounded"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={handleKey}
            placeholder="C:\Users\Name\Documents"
            style={{ padding: '10px 14px', fontSize: '12px' }}
          />
        </div>
        <button
          className="btn-neon-cyan rounded"
          onClick={handleAdd}
          style={{ padding: '10px 16px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          ADD
        </button>
      </div>
      <p style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '10px', color: 'rgba(0,255,232,0.3)', marginTop: 4 }}>
        Нажмите Enter или ADD для добавления пути
      </p>
    </div>
  );
}
