import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
  error: string | null;
  envError?: string | null;
}

/**
 * Displays error messages in a consistent format.
 * Combines general errors and environment configuration errors.
 */
export function ErrorDisplay({ error, envError }: ErrorDisplayProps) {
  const { t } = useTranslation(['common', 'settings']);

  const displayError = error || envError;

  if (!displayError) {
    return null;
  }

  return (
    <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
      {displayError}
    </div>
  );
}
