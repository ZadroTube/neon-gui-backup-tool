export interface BackupEntry {
  id: string;
  name: string;
  sourcePaths: string[];
  destinationPath: string;
  timestamp: Date;
  status: 'success' | 'error' | 'running';
  size: string;
  filesCount: number;
  duration: number; // seconds
  log: string[];
}

export interface BackupProfile {
  id: string;
  name: string;
  sourcePaths: string[];
  destinationPath: string;
  createdAt: Date;
  lastBackup: Date | null;
  backupCount: number;
}

export type AppTab = 'backup' | 'history' | 'profiles';
export type BackupStatus = 'idle' | 'running' | 'done' | 'error';
