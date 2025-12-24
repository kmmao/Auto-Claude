import { useState, useEffect } from 'react';
import { Brain, Scale, Zap, Check, Sparkles, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';
import {
  DEFAULT_AGENT_PROFILES,
  AVAILABLE_MODELS,
  THINKING_LEVELS,
  DEFAULT_PHASE_MODELS,
  DEFAULT_PHASE_THINKING,
  IPC_CHANNELS
} from '../../../shared/constants';
import { useSettingsStore, saveSettings } from '../../stores/settings-store';
import { SettingsSection } from './SettingsSection';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import type { AgentProfile, PhaseModelConfig, PhaseThinkingConfig, ModelTypeShort, ThinkingLevel } from '../../../shared/types/settings';

/**
 * Icon mapping for agent profile icons
 */
const iconMap: Record<string, React.ElementType> = {
  Brain,
  Scale,
  Zap,
  Sparkles
};

const PHASE_LABELS: Record<keyof PhaseModelConfig, { label: string; description: string }> = {
  spec: { label: 'Spec Creation', description: 'Discovery, requirements, context gathering' },
  planning: { label: 'Planning', description: 'Implementation planning and architecture' },
  coding: { label: 'Coding', description: 'Actual code implementation' },
  qa: { label: 'QA Review', description: 'Quality assurance and validation' }
};

/**
 * Display info about ~/.claude/CLAUDE.md if active
 */
function ClaudeMdInfo() {
  const { t } = useTranslation(['settings']);
  const [data, setData] = useState<{ exists: boolean; content: string; path: string } | null>(null);

  useEffect(() => {
    const checkFile = async () => {
      try {
        const result = await (window as any).electronAPI.getClaudeMd();
        if (result.success && result.data.exists) {
          setData(result.data);
        }
      } catch (err) {
        console.error('Failed to check CLAUDE.md:', err);
      }
    };
    checkFile();
  }, []);

  if (!data?.exists) return null;

  return (
    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-900/20">
      <div className="flex items-start gap-2">
        <div className="mt-0.5 text-blue-600 dark:text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="16" y2="12" /><line x1="12" x2="12.01" y1="8" y2="8" /></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
            {t('agent.rules.claudeMdDetected', 'Global Rules Detected')}
          </h4>
          <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
            {t('agent.rules.claudeMdDescription', 'Content from your local configuration file is being automatically appended to the global rules.')}
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            <code className="rounded bg-black/5 px-1 py-0.5 font-mono dark:bg-white/10">{data.path}</code>
          </div>
          {data.content && (
            <div className="mt-2 text-xs text-muted-foreground/80">
              <details>
                <summary className="cursor-pointer hover:underline">Preview content</summary>
                <pre className="mt-2 whitespace-pre-wrap rounded bg-black/5 p-2 font-mono text-[10px] dark:bg-white/5">
                  {data.content.slice(0, 300)}{data.content.length > 300 ? '...' : ''}
                </pre>
              </details>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Agent Profile Settings component
 * Displays preset agent profiles for quick model/thinking level configuration
 * Used in the Settings page under Agent Settings
 */
export function AgentProfileSettings() {
  const { t } = useTranslation(['common', 'settings']);

  const settings = useSettingsStore((state) => state.settings);
  const selectedProfileId = settings.selectedAgentProfile || 'auto';
  const [showPhaseConfig, setShowPhaseConfig] = useState(selectedProfileId === 'auto');

  // Get current phase config from settings or defaults
  const currentPhaseModels: PhaseModelConfig = settings.customPhaseModels || DEFAULT_PHASE_MODELS;
  const currentPhaseThinking: PhaseThinkingConfig = settings.customPhaseThinking || DEFAULT_PHASE_THINKING;

  const handleSelectProfile = async (profileId: string) => {
    const success = await saveSettings({ selectedAgentProfile: profileId });
    if (!success) {
      // Log error for debugging - in future could show user toast notification
      console.error('Failed to save agent profile selection');
      return;
    }
    // Auto-expand phase config when Auto profile is selected
    if (profileId === 'auto') {
      setShowPhaseConfig(true);
    }
  };

  const handlePhaseModelChange = async (phase: keyof PhaseModelConfig, value: ModelTypeShort) => {
    const newPhaseModels = { ...currentPhaseModels, [phase]: value };
    await saveSettings({ customPhaseModels: newPhaseModels });
  };

  const handlePhaseThinkingChange = async (phase: keyof PhaseThinkingConfig, value: ThinkingLevel) => {
    const newPhaseThinking = { ...currentPhaseThinking, [phase]: value };
    await saveSettings({ customPhaseThinking: newPhaseThinking });
  };

  const handleResetToDefaults = async () => {
    await saveSettings({
      customPhaseModels: DEFAULT_PHASE_MODELS,
      customPhaseThinking: DEFAULT_PHASE_THINKING
    });
  };

  /**
   * Get human-readable model label
   */
  const getModelLabel = (modelValue: string): string => {
    const model = AVAILABLE_MODELS.find((m) => m.value === modelValue);
    return model?.label || modelValue;
  };

  /**
   * Get human-readable thinking level label
   */
  const getThinkingLabel = (thinkingValue: string): string => {
    return t(`settings:agent.thinking.${thinkingValue}.label`, { defaultValue: thinkingValue });
  };

  /**
   * Check if current phase config differs from defaults
   */
  const hasCustomConfig = (): boolean => {
    const phases: Array<keyof PhaseModelConfig> = ['spec', 'planning', 'coding', 'qa'];
    return phases.some(
      phase =>
        currentPhaseModels[phase] !== DEFAULT_PHASE_MODELS[phase] ||
        currentPhaseThinking[phase] !== DEFAULT_PHASE_THINKING[phase]
    );
  };

  /**
   * Render a single profile card
   */
  const renderProfileCard = (profile: AgentProfile) => {
    const isSelected = selectedProfileId === profile.id;
    const Icon = iconMap[profile.icon || 'Brain'] || Brain;

    return (
      <button
        key={profile.id}
        onClick={() => handleSelectProfile(profile.id)}
        className={cn(
          'relative w-full rounded-lg border p-4 text-left transition-all duration-200',
          'hover:border-primary/50 hover:shadow-sm',
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-border bg-card'
        )}
      >
        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}

        {/* Profile content */}
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg shrink-0',
              isSelected ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5',
                isSelected ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <h3 className="font-medium text-sm text-foreground">
              {t(`settings:agent.profiles.${profile.id}.name`, { defaultValue: profile.name })}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {t(`settings:agent.profiles.${profile.id}.description`, { defaultValue: profile.description })}
            </p>

            {/* Model and thinking level badges */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {getModelLabel(profile.model)}
              </span>
              <span className="inline-flex items-center rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {t("settings:agent.profile.thinking", { level: getThinkingLabel(profile.thinkingLevel) })}
              </span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-8">
      <SettingsSection
        title={t("settings:agent.profile.title")}
        description={t("settings:agent.profile.description")}
      >
        <div className="space-y-4">
          {/* Description */}
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              {t("settings:agent.profile.hint")}
            </p>
          </div>

          {/* Profile cards - 2 column grid on larger screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {DEFAULT_AGENT_PROFILES.map(renderProfileCard)}
          </div>

          {/* Phase Configuration (only for Auto profile) */}
          {selectedProfileId === 'auto' && (
            <div className="mt-6 rounded-lg border border-border bg-card">
              {/* Header - Collapsible */}
              <button
                type="button"
                onClick={() => setShowPhaseConfig(!showPhaseConfig)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors rounded-t-lg"
              >
                <div>
                  <h4 className="font-medium text-sm text-foreground">{t("settings:agent.profile.phaseConfig.title")}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("settings:agent.profile.phaseConfig.description")}
                  </p>
                </div>
                {showPhaseConfig ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {/* Phase Configuration Content */}
              {showPhaseConfig && (
                <div className="border-t border-border p-4 space-y-4">
                  {/* Reset button */}
                  {hasCustomConfig() && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetToDefaults}
                        className="text-xs h-7"
                      >
                        <RotateCcw className="h-3 w-3 mr-1.5" />
                        {t("settings:agent.profile.phaseConfig.reset")}
                      </Button>
                    </div>
                  )}

                  {/* Phase Configuration Grid */}
                  <div className="space-y-4">
                    {(Object.keys(PHASE_LABELS) as Array<keyof PhaseModelConfig>).map((phase) => (
                      <div key={phase} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-foreground">
                            {t(`settings:agent.profile.phaseConfig.${phase}.label`)}
                          </Label>
                          <span className="text-xs text-muted-foreground">
                            {t(`settings:agent.profile.phaseConfig.${phase}.description`)}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {/* Model Select */}
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{t("settings:agent.profile.model")}</Label>
                            <Select
                              value={currentPhaseModels[phase]}
                              onValueChange={(value) => handlePhaseModelChange(phase, value as ModelTypeShort)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {AVAILABLE_MODELS.map((m) => (
                                  <SelectItem key={m.value} value={m.value}>
                                    {m.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {/* Thinking Level Select */}
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">{t("settings:agent.profile.thinkingLevel")}</Label>
                            <Select
                              value={currentPhaseThinking[phase]}
                              onValueChange={(value) => handlePhaseThinkingChange(phase, value as ThinkingLevel)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {THINKING_LEVELS.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {t(`settings:agent.thinking.${level.value}.label`)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Info note */}
                  <p className="text-[10px] text-muted-foreground mt-4 pt-3 border-t border-border">
                    {t("settings:agent.profile.phaseConfig.hint")}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </SettingsSection>

      {/* Global Agent Rules */}
      <SettingsSection
        title={t("settings:agent.rules.title", "Global Agent Rules")}
        description={t("settings:agent.rules.description", "Set behavioral rules that apply to all agent tasks (e.g., 'Always output Chinese', 'Prefer functional programming').")}
      >
        <div className="space-y-3">
          <Label htmlFor="globalAgentRules" className="text-sm font-medium text-foreground">
            {t("settings:agent.rules.label", "System Instructions")}
          </Label>
          <div className="relative">
            <textarea
              id="globalAgentRules"
              className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
              placeholder={t("settings:agent.rules.placeholder", "e.g. \n- Always respond in Chinese\n- Use 2 spaces for indentation\n- Avoid using try-catch blocks unless necessary")}
              value={settings.globalAgentRules || ''}
              onChange={(e) => {
                const newValue = e.target.value;
                // Update local state immediately for responsiveness
                useSettingsStore.setState((state) => ({
                  settings: { ...state.settings, globalAgentRules: newValue }
                }));
                // Debounce save is handled by listener, but we can also save explicitly on blur if needed
                saveSettings({ globalAgentRules: newValue });
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t("settings:agent.rules.hint", "These instructions are injected into the system prompt for every agent task.")}
          </p>

          <ClaudeMdInfo />
        </div>
      </SettingsSection>
    </div>
  );
}
