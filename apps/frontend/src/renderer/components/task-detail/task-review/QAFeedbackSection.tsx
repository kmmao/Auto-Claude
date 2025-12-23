import { AlertCircle, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { useTranslation } from 'react-i18next';

interface QAFeedbackSectionProps {
  feedback: string;
  isSubmitting: boolean;
  onFeedbackChange: (value: string) => void;
  onReject: () => void;
}

/**
 * Displays the QA feedback section where users can request changes
 */
export function QAFeedbackSection({
  feedback,
  isSubmitting,
  onFeedbackChange,
  onReject
}: QAFeedbackSectionProps) {
  const { t } = useTranslation(['common', 'taskDetail']);

  return (
    <div className="rounded-xl border border-warning/30 bg-warning/10 p-4">
      <h3 className="font-medium text-sm text-foreground mb-2 flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-warning" />
        {t('taskDetail:feedback.title')}
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        {t('taskDetail:feedback.description')}
      </p>
      <Textarea
        placeholder={t('taskDetail:feedback.placeholder')}
        value={feedback}
        onChange={(e) => onFeedbackChange(e.target.value)}
        className="mb-3"
        rows={3}
      />
      <Button
        variant="warning"
        onClick={onReject}
        disabled={isSubmitting || !feedback.trim()}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('taskDetail:feedback.submitting')}
          </>
        ) : (
          <>
            <RotateCcw className="mr-2 h-4 w-4" />
            {t('taskDetail:feedback.submit')}
          </>
        )}
      </Button>
    </div>
  );
}
