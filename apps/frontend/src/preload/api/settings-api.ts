import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../../shared/constants';
import type {
  AppSettings,
  IPCResult,
  SourceEnvConfig,
  SourceEnvCheckResult
} from '../../shared/types';

export interface SettingsAPI {
  // App Settings
  getSettings: () => Promise<IPCResult<AppSettings>>;
  saveSettings: (settings: Partial<AppSettings>) => Promise<IPCResult>;

  // App Info
  getAppVersion: () => Promise<string>;

  // Auto-Build Source Environment
  getSourceEnv: () => Promise<IPCResult<SourceEnvConfig>>;
  updateSourceEnv: (config: { claudeOAuthToken?: string }) => Promise<IPCResult>;
  checkSourceToken: () => Promise<IPCResult<SourceEnvCheckResult>>;

  // Python Path Detection
  getPythonPaths: () => Promise<string[]>;

  // Global Rules
  getClaudeMd: () => Promise<IPCResult<{ exists: boolean; content: string; path: string }>>;
}

export const createSettingsAPI = (): SettingsAPI => ({
  // App Settings
  getSettings: (): Promise<IPCResult<AppSettings>> =>
    ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET),

  saveSettings: (settings: Partial<AppSettings>): Promise<IPCResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_SAVE, settings),

  // App Info
  getAppVersion: (): Promise<string> =>
    ipcRenderer.invoke(IPC_CHANNELS.APP_VERSION),

  // Auto-Build Source Environment
  getSourceEnv: (): Promise<IPCResult<SourceEnvConfig>> =>
    ipcRenderer.invoke(IPC_CHANNELS.AUTOBUILD_SOURCE_ENV_GET),

  updateSourceEnv: (config: { claudeOAuthToken?: string }): Promise<IPCResult> =>
    ipcRenderer.invoke(IPC_CHANNELS.AUTOBUILD_SOURCE_ENV_UPDATE, config),

  checkSourceToken: (): Promise<IPCResult<SourceEnvCheckResult>> =>
    ipcRenderer.invoke(IPC_CHANNELS.AUTOBUILD_SOURCE_ENV_CHECK_TOKEN),

  // Python Path Detection
  getPythonPaths: (): Promise<string[]> =>
    ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET_PYTHON_PATHS),

  // Global Rules
  getClaudeMd: (): Promise<IPCResult<{ exists: boolean; content: string; path: string }>> =>
    ipcRenderer.invoke(IPC_CHANNELS.SETTINGS_GET_CLAUDE_MD)
});
