import React from 'react';

interface Props {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  accentColor?: 'cyan' | 'pink';
  icon?: React.ReactNode;
  hint?: string;
}

export default function PathInput({ label, value, onChange, placeholder, accentColor = 'cyan', icon, hint }: Props) {
  const colors = {
    cyan: { border: 'rgba(0,255,232,0.4)', glow: '#00ffe8', text: '#00ffe8', label: 'rgba(0,255,232,0.7)' },
    pink: { border: 'rgba(255,0,222,0.4)', glow: '#ff00de', text: '#ff00de', label: 'rgba(255,0,222,0.7)' },
  };
  const c = colors[accentColor];

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span style={{ color: c.text, filter: `drop-shadow(0 0 4px ${c.glow})` }}>{icon}</span>}
        <label style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '10px',
          fontWeight: 600,
          color: c.label,
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          {label}
        </label>
      </div>
      <div className="relative flex items-center">
        {/* Corner decoration top-left */}
        <div className="absolute top-0 left-0 w-3 h-3 pointer-events-none" style={{ zIndex: 1 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 12, height: 2, background: c.glow, boxShadow: `0 0 6px ${c.glow}` }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: 12, background: c.glow, boxShadow: `0 0 6px ${c.glow}` }} />
        </div>
        {/* Corner decoration bottom-right */}
        <div className="absolute bottom-0 right-0 w-3 h-3 pointer-events-none" style={{ zIndex: 1 }}>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 2, background: c.glow, boxShadow: `0 0 6px ${c.glow}` }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 2, height: 12, background: c.glow, boxShadow: `0 0 6px ${c.glow}` }} />
        </div>
        <input
          type="text"
          className="neon-input w-full rounded"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            padding: '12px 16px',
            border: `1px solid ${c.border}`,
            color: c.text,
          }}
        />
      </div>
      {hint && (
        <p style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: '10px',
          color: 'rgba(0,255,232,0.3)',
          marginTop: 4,
        }}>
          {hint}
        </p>
      )}
    </div>
  );
}
