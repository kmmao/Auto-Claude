import { CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui/button';
import { cn } from '../../../lib/utils';
import type { MergeConflict, MergeStats, GitConflictInfo } from '../../../../shared/types';
import { useTranslation } from 'react-i18next';

interface MergePreviewSummaryProps {
  mergePreview: {
    files: string[];
    conflicts: MergeConflict[];
    summary: MergeStats;
    gitConflicts?: GitConflictInfo;
  };
  onShowConflictDialog: (show: boolean) => void;
}

/**
 * Displays a summary of the merge preview including conflicts and statistics
 */
export function MergePreviewSummary({
  mergePreview,
  onShowConflictDialog
}: MergePreviewSummaryProps) {
  const { t } = useTranslation(['common', 'taskDetail']);

  const hasGitConflicts = mergePreview.gitConflicts?.hasConflicts;
  const hasAIConflicts = mergePreview.conflicts.length > 0;
  const hasHighSeverity = mergePreview.conflicts.some(
    c => c.severity === 'high' || c.severity === 'critical'
  );

  return (
    <div className={cn(
      "rounded-lg p-3 mb-3 border",
      hasGitConflicts
        ? "bg-warning/10 border-warning/30"
        : !hasAIConflicts
          ? "bg-success/10 border-success/30"
          : hasHighSeverity
            ? "bg-destructive/10 border-destructive/30"
            : "bg-warning/10 border-warning/30"
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium flex items-center gap-2">
          {hasGitConflicts ? (
            <>
              <AlertTriangle className="h-4 w-4 text-warning" />
              {t('taskDetail:conflict.branchDiverged')}
            </>
          ) : !hasAIConflicts ? (
            <>
              <CheckCircle className="h-4 w-4 text-success" />
              {t('taskDetail:conflict.noConflicts')}
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 text-warning" />
              {t('taskDetail:conflict.detected', { count: mergePreview.conflicts.length })}
            </>
          )}
        </span>
        {hasAIConflicts && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onShowConflictDialog(true)}
            className="h-7 text-xs"
          >
            {t('taskDetail:conflict.viewDetails')}
          </Button>
        )}
      </div>

      {hasGitConflicts && mergePreview.gitConflicts && (
        <div className="mb-3 p-2 bg-warning/10 rounded text-xs border border-warning/30">
          <p className="font-medium text-warning mb-1">{t('taskDetail:conflict.divergedTitle')}</p>
          <p className="text-muted-foreground mb-2">
            {t('taskDetail:conflict.divergedDesc', {
              count: mergePreview.gitConflicts.commitsBehind,
              files: mergePreview.gitConflicts.conflictingFiles.length
            })}
          </p>
          <ul className="list-disc list-inside text-muted-foreground">
            {mergePreview.gitConflicts.conflictingFiles.map((file, idx) => (
              <li key={idx} className="truncate">{file}</li>
            ))}
          </ul>
          <p className="mt-2 text-muted-foreground">
            {t('taskDetail:conflict.aiResolveNote')}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>{t('taskDetail:conflict.filesToMerge', { count: mergePreview.summary.totalFiles })}</div>
        {hasGitConflicts ? (
          <div className="text-warning">{t('taskDetail:conflict.aiWillResolve')}</div>
        ) : hasAIConflicts ? (
          <>
            <div>{t('taskDetail:conflict.autoMergeable', { count: mergePreview.summary.autoMergeable })}</div>
            {mergePreview.summary.aiResolved !== undefined && (
              <div>{t('taskDetail:conflict.aiResolved', { count: mergePreview.summary.aiResolved })}</div>
            )}
            {mergePreview.summary.humanRequired !== undefined && mergePreview.summary.humanRequired > 0 && (
              <div className="text-warning">{t('taskDetail:conflict.manualReview', { count: mergePreview.summary.humanRequired })}</div>
            )}
          </>
        ) : (
          <div className="text-success">{t('taskDetail:conflict.readyToMerge')}</div>
        )}
      </div>
    </div>
  );
}
