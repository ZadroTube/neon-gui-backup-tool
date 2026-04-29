import { BackupEntry, BackupProfile } from '../types';

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function formatTimestamp(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  return `${y}-${mo}-${d}_${h}-${mi}-${s}`;
}

export function formatDisplayDate(date: Date): string {
  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}с`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}м ${s}с`;
}

export function simulateRandomSize(): string {
  const units = ['KB', 'MB', 'GB'];
  const sizes = [
    { value: Math.floor(Math.random() * 900 + 100), unit: 'KB' },
    { value: +(Math.random() * 500 + 10).toFixed(1), unit: 'MB' },
    { value: +(Math.random() * 50 + 1).toFixed(2), unit: 'GB' },
  ];
  const pick = sizes[Math.floor(Math.random() * units.length)];
  return `${pick.value} ${pick.unit}`;
}

export function simulateFileCount(): number {
  return Math.floor(Math.random() * 9000 + 100);
}

export function getBackupFolderName(profileName: string, date: Date): string {
  return `${profileName.replace(/[^a-zA-Zа-яА-Я0-9_]/g, '_')}_backup_${formatTimestamp(date)}`;
}

export function generateBackupLog(
  sources: string[],
  dest: string,
  folderName: string,
  filesCount: number,
  size: string
): string[] {
  const lines: string[] = [];
  const ts = () => formatTimestamp(new Date());

  lines.push(`[${ts()}] ▶ Инициализация резервного копирования...`);
  lines.push(`[${ts()}] ▶ Проверка исходных директорий (${sources.length} шт.)...`);
  
  sources.forEach((src, i) => {
    lines.push(`[${ts()}] ✓ Источник ${i + 1}: ${src}`);
  });

  lines.push(`[${ts()}] ▶ Целевой каталог: ${dest}`);
  lines.push(`[${ts()}] ▶ Создание папки резервной копии: ${folderName}`);
  lines.push(`[${ts()}] ▶ Начало копирования файлов...`);

  const totalBatches = Math.min(sources.length * 3, 8);
  for (let i = 0; i < totalBatches; i++) {
    const count = Math.floor(filesCount / totalBatches);
    lines.push(`[${ts()}] → Обработано файлов: ${(i + 1) * count} / ${filesCount}`);
  }

  lines.push(`[${ts()}] ▶ Создание архива ZIP...`);
  lines.push(`[${ts()}] ▶ Проверка целостности данных...`);
  lines.push(`[${ts()}] ✓ Скопировано файлов: ${filesCount}`);
  lines.push(`[${ts()}] ✓ Размер резервной копии: ${size}`);
  lines.push(`[${ts()}] ✓ Путь сохранения: ${dest}\\${folderName}`);
  lines.push(`[${ts()}] ██████████████████████████ 100%`);
  lines.push(`[${ts()}] ✅ РЕЗЕРВНАЯ КОПИЯ УСПЕШНО СОЗДАНА`);

  return lines;
}

// Local storage helpers
const STORAGE_KEY_HISTORY = 'neonbackup_history';
const STORAGE_KEY_PROFILES = 'neonbackup_profiles';

export function loadHistory(): BackupEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((e: BackupEntry) => ({ ...e, timestamp: new Date(e.timestamp) }));
  } catch {
    return [];
  }
}

export function saveHistory(history: BackupEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history.slice(0, 50)));
  } catch {}
}

export function loadProfiles(): BackupProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.map((p: BackupProfile) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      lastBackup: p.lastBackup ? new Date(p.lastBackup) : null,
    }));
  } catch {
    return [];
  }
}

export function saveProfiles(profiles: BackupProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch {}
}
