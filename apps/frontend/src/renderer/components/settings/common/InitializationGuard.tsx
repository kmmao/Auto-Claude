import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface InitializationGuardProps {
  initialized: boolean;
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Guard component that shows a message when Auto-Build is not initialized.
 * Used to prevent configuration of features that require Auto-Build setup.
 */
export function InitializationGuard({
  initialized,
  title,
  description: _description,
  children
}: InitializationGuardProps) {
  const { t } = useTranslation(['common', 'settings']);

  if (!initialized) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
        {t("settings:project.general.autoBuild.initializeFirst", { feature: title })}
      </div>
    );
  }

  return <>{children}</>;
}
