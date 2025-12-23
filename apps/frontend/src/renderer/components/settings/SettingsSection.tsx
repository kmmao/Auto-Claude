import { Separator } from '../ui/separator';
import { useTranslation } from 'react-i18next';

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

/**
 * Reusable wrapper component for settings sections
 * Provides consistent layout and styling
 */
export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  const { t } = useTranslation(['common', 'settings']);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Separator />
      {children}
    </div>
  );
}
