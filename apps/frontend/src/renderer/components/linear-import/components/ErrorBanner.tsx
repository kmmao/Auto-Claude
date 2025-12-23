/**
 * Error banner for displaying error messages
 */

import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
interface ErrorBannerProps {
  error: string;
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  const { t } = useTranslation(['common', 'settings']);

  return (
    <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 flex items-center gap-2">
      <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
      <p className="text-sm text-destructive">{error}</p>
    </div>
  );
}
