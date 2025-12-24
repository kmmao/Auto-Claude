/**
 * Application settings types
 */

import type { NotificationSettings } from './project';
import type { ChangelogFormat, ChangelogAudience, ChangelogEmojiLevel } from './changelog';

// Color theme types for multi-theme support
export type ColorTheme = 'default' | 'dusk' | 'lime' | 'ocean' | 'retro' | 'neo' | 'forest';

export interface ThemePreviewColors {
  bg: string;
  accent: string;
  darkBg: string;
  darkAccent?: string;
}

export interface ColorThemeDefinition {
  id: ColorTheme;
  name: string;
  description: string;
  previewColors: ThemePreviewColors;
}

// Thinking level for Claude model (budget token allocation)
export type ThinkingLevel = 'none' | 'low' | 'medium' | 'high' | 'ultrathink';

// Model type shorthand
export type ModelTypeShort = 'haiku' | 'sonnet' | 'opus';

// Phase-based model configuration for Auto profile
// Each phase can use a different model optimized for that task type
export interface PhaseModelConfig {
  spec: ModelTypeShort;       // Spec creation (discovery, requirements, context)
  planning: ModelTypeShort;   // Implementation planning
  coding: ModelTypeShort;     // Actual coding implementation
  qa: ModelTypeShort;         // QA review and fixing
}

// Thinking level configuration per phase
export interface PhaseThinkingConfig {
  spec: ThinkingLevel;
  planning: ThinkingLevel;
  coding: ThinkingLevel;
  qa: ThinkingLevel;
}

// Feature-specific model configuration (for non-pipeline features)
export interface FeatureModelConfig {
  insights: ModelTypeShort;    // Insights chat feature
  ideation: ModelTypeShort;    // Ideation generation
  roadmap: ModelTypeShort;     // Roadmap generation
}

// Feature-specific thinking level configuration
export interface FeatureThinkingConfig {
  insights: ThinkingLevel;
  ideation: ThinkingLevel;
  roadmap: ThinkingLevel;
}

// Agent profile for preset model/thinking configurations
export interface AgentProfile {
  id: string;
  name: string;
  description: string;
  model: ModelTypeShort;
  thinkingLevel: ThinkingLevel;
  icon?: string;  // Lucide icon name
  // Auto profile specific - per-phase configuration
  isAutoProfile?: boolean;
  phaseModels?: PhaseModelConfig;
  phaseThinking?: PhaseThinkingConfig;
}

// Python interpreter detection types
// Source indicates where the Python interpreter was installed from
export type PythonInterpreterSource = 'homebrew' | 'system' | 'pyenv' | 'custom' | 'unknown';

// Detected Python interpreter information
export interface PythonInterpreter {
  /** Full path to the Python executable */
  path: string;
  /** Python version string (e.g., "3.11.5") */
  version: string;
  /** Whether this interpreter matches the currently configured pythonPath */
  isActive: boolean;
  /** Source/origin of this Python installation */
  source: PythonInterpreterSource;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  colorTheme?: ColorTheme;
  /** Interface language preference (e.g., 'en', 'zh-CN', 'fr') */
  language?: string;
  defaultModel: string;
  agentFramework: string;
  pythonPath?: string;
  autoBuildPath?: string;
  autoUpdateAutoBuild: boolean;
  autoNameTerminals: boolean;
  notifications: NotificationSettings;
  // Global API keys (used as defaults for all projects)
  globalClaudeOAuthToken?: string;
  globalOpenAIApiKey?: string;
  globalAnthropicApiKey?: string;
  globalGoogleApiKey?: string;
  globalGroqApiKey?: string;
  globalOpenRouterApiKey?: string;
  // Graphiti LLM provider settings
  graphitiLlmProvider?: 'openai' | 'anthropic' | 'google' | 'groq' | 'ollama';
  ollamaBaseUrl?: string;
  // Onboarding wizard completion state
  onboardingCompleted?: boolean;
  // Selected agent profile for preset model/thinking configurations
  selectedAgentProfile?: string;
  // Custom phase configuration for Auto profile (overrides defaults)
  customPhaseModels?: PhaseModelConfig;
  customPhaseThinking?: PhaseThinkingConfig;
  // Feature-specific configuration (insights, ideation, roadmap)
  featureModels?: FeatureModelConfig;
  featureThinking?: FeatureThinkingConfig;
  // Changelog preferences
  changelogFormat?: ChangelogFormat;
  changelogAudience?: ChangelogAudience;
  changelogEmojiLevel?: ChangelogEmojiLevel;
  // UI Scale setting (75-200%, default 100)
  uiScale?: number;
  // Beta updates opt-in (receive pre-release updates)
  betaUpdates?: boolean;
  // Migration flags (internal use)
  _migratedAgentProfileToAuto?: boolean;
  // Global behavioral rules injected into every agent prompt
  globalAgentRules?: string;
}

// Auto-Claude Source Environment Configuration (for auto-claude repo .env)
export interface SourceEnvConfig {
  // Claude Authentication (required for ideation, roadmap generation, etc.)
  hasClaudeToken: boolean;
  claudeOAuthToken?: string;

  // Source path info
  sourcePath?: string;
  envExists: boolean;
}

export interface SourceEnvCheckResult {
  hasToken: boolean;
  sourcePath?: string;
  error?: string;
}

// Auto Claude Source Update Types
export interface AutoBuildSourceUpdateCheck {
  updateAvailable: boolean;
  currentVersion: string;
  latestVersion?: string;
  releaseNotes?: string;
  releaseUrl?: string;
  error?: string;
}

export interface AutoBuildSourceUpdateResult {
  success: boolean;
  version?: string;
  error?: string;
}

export interface AutoBuildSourceUpdateProgress {
  stage: 'checking' | 'downloading' | 'extracting' | 'complete' | 'error';
  percent?: number;
  message: string;
  /** New version after successful update - used to refresh UI */
  newVersion?: string;
}
