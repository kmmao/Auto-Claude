import { SettingsSection } from './SettingsSection';
import { ThemeSelector } from './ThemeSelector';
import type { AppSettings } from '../../../shared/types';
import { useTranslation } from 'react-i18next';

interface ThemeSettingsProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

/**
 * Theme and appearance settings section
 * Wraps the ThemeSelector component with a consistent settings section layout
 */
export function ThemeSettings({ settings, onSettingsChange }: ThemeSettingsProps) {
  const { t } = useTranslation(['common', 'settings']);

  return (
    <SettingsSection
      title={t("settings:appearance.title")}
      description={t("settings:appearance.description")}
    >
      <ThemeSelector settings={settings} onSettingsChange={onSettingsChange} />
    </SettingsSection>
  );
}
