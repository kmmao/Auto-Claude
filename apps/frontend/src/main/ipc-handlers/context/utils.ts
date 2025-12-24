import { app } from 'electron';
import path from 'path';
import { existsSync, readFileSync } from 'fs';

export interface EnvironmentVars {
  [key: string]: string;
}

export interface GlobalSettings {
  autoBuildPath?: string;
  globalOpenAIApiKey?: string;
}

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

/**
 * Get the auto-build source path from settings
 */
export function getAutoBuildSourcePath(): string | null {
  if (existsSync(settingsPath)) {
    try {
      const content = readFileSync(settingsPath, 'utf-8');
      const settings = JSON.parse(content);
      if (settings.autoBuildPath && existsSync(settings.autoBuildPath)) {
        return settings.autoBuildPath;
      }
    } catch {
      // Fall through to null
    }
  }
  return null;
}

/**
 * Parse .env file content into key-value pairs
 * Handles both Unix and Windows line endings
 */
export function parseEnvFile(envContent: string): EnvironmentVars {
  const vars: EnvironmentVars = {};

  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > 0) {
      const key = trimmed.substring(0, eqIndex).trim();
      let value = trimmed.substring(eqIndex + 1).trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      vars[key] = value;
    }
  }

  return vars;
}

/**
 * Load environment variables from project .env file
 */
export function loadProjectEnvVars(projectPath: string, autoBuildPath?: string): EnvironmentVars {
  if (!autoBuildPath) {
    return {};
  }

  const projectEnvPath = path.join(projectPath, autoBuildPath, '.env');
  if (!existsSync(projectEnvPath)) {
    return {};
  }

  try {
    const envContent = readFileSync(projectEnvPath, 'utf-8');
    return parseEnvFile(envContent);
  } catch {
    return {};
  }
}

/**
 * Load global settings from user data directory
 */
export function loadGlobalSettings(): GlobalSettings {
  if (!existsSync(settingsPath)) {
    return {};
  }

  try {
    const settingsContent = readFileSync(settingsPath, 'utf-8');
    return JSON.parse(settingsContent);
  } catch {
    return {};
  }
}

/**
 * Check if Graphiti is enabled in project or global environment
 */
export function isGraphitiEnabled(projectEnvVars: EnvironmentVars): boolean {
  return (
    projectEnvVars['GRAPHITI_ENABLED']?.toLowerCase() === 'true' ||
    process.env.GRAPHITI_ENABLED?.toLowerCase() === 'true'
  );
}

/**
 * Get configured Graphiti providers
 */
export function getGraphitiProviders(projectEnvVars: EnvironmentVars): { llm: string, embedder: string } {
  const llm = projectEnvVars['GRAPHITI_LLM_PROVIDER'] || process.env.GRAPHITI_LLM_PROVIDER || 'openai';
  const embedder = projectEnvVars['GRAPHITI_EMBEDDER_PROVIDER'] || process.env.GRAPHITI_EMBEDDER_PROVIDER || 'openai';
  return { llm, embedder };
}

/**
 * Check if the required API keys for selected Graphiti providers are available.
 * Returns a result indicating availability and a reason if not.
 */
export function checkGraphitiAvailability(
  projectEnvVars: EnvironmentVars,
  globalSettings: GlobalSettings
): { available: boolean; reason?: string } {
  const { embedder } = getGraphitiProviders(projectEnvVars);

  const checkKey = (key: string, globalKey?: string) => {
    return !!(projectEnvVars[key] || (globalKey && globalSettings[globalKey as keyof GlobalSettings]) || process.env[key]);
  };

  if (embedder === 'openai') {
    if (!checkKey('OPENAI_API_KEY', 'globalOpenAIApiKey')) {
      return { available: false, reason: 'OPENAI_API_KEY not set (required for OpenAI embeddings)' };
    }
  } else if (embedder === 'anthropic') {
    if (!checkKey('ANTHROPIC_API_KEY')) {
      return { available: false, reason: 'ANTHROPIC_API_KEY not set (required for Anthropic embeddings)' };
    }
  } else if (embedder === 'voyage') {
    if (!checkKey('VOYAGE_API_KEY')) {
      return { available: false, reason: 'VOYAGE_API_KEY not set (required for Voyage embeddings)' };
    }
  } else if (embedder === 'google') {
    if (!checkKey('GOOGLE_API_KEY')) {
      return { available: false, reason: 'GOOGLE_API_KEY not set (required for Google embeddings)' };
    }
  } else if (embedder === 'azure_openai') {
    if (!checkKey('AZURE_OPENAI_API_KEY')) {
      return { available: false, reason: 'AZURE_OPENAI_API_KEY not set (required for Azure OpenAI embeddings)' };
    }
    // Could also check for base URL and deployment, but api key is the main one
  } else if (embedder === 'openrouter') {
    if (!checkKey('OPENROUTER_API_KEY')) {
      return { available: false, reason: 'OPENROUTER_API_KEY not set (required for OpenRouter embeddings)' };
    }
  } else if (embedder === 'ollama') {
    // Ollama doesn't need an API key
    if (!projectEnvVars['OLLAMA_EMBEDDING_MODEL'] && !process.env.OLLAMA_EMBEDDING_MODEL) {
      return { available: false, reason: 'OLLAMA_EMBEDDING_MODEL not set' };
    }
    return { available: true };
  }

  return { available: true };
}

/**
 * Get Graphiti database details (LadybugDB - embedded database)
 */
export interface GraphitiDatabaseDetails {
  dbPath: string;
  database: string;
}

export function getGraphitiDatabaseDetails(projectEnvVars: EnvironmentVars): GraphitiDatabaseDetails {
  const dbPath = projectEnvVars['GRAPHITI_DB_PATH'] ||
    process.env.GRAPHITI_DB_PATH ||
    require('path').join(require('os').homedir(), '.auto-claude', 'memories');

  const database = projectEnvVars['GRAPHITI_DATABASE'] ||
    process.env.GRAPHITI_DATABASE ||
    'auto_claude_memory';

  return { dbPath, database };
}
