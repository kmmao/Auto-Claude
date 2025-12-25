import {
  GitBranch,
  FileCode,
  Plus,
  Minus,
  Eye,
  ExternalLink,
  GitMerge,
  FolderX,
  Loader2,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  GitCommit,
  Terminal,
  Package
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { cn } from '../../../lib/utils';
import type { Task, WorktreeStatus, MergeConflict, MergeStats, GitConflictInfo } from '../../../../shared/types';
import { useTerminalHandler } from '../hooks/useTerminalHandler';

interface WorkspaceStatusProps {
  task: Task;
  worktreeStatus: WorktreeStatus;
  workspaceError: string | null;
  stageOnly: boolean;
  mergePreview: { files: string[]; conflicts: MergeConflict[]; summary: MergeStats; gitConflicts?: GitConflictInfo; uncommittedChanges?: { hasChanges: boolean; files: string[]; count: number } | null } | null;
  isLoadingPreview: boolean;
  isMerging: boolean;
  isDiscarding: boolean;
  onShowDiffDialog: (show: boolean) => void;
  onShowDiscardDialog: (show: boolean) => void;
  onShowConflictDialog: (show: boolean) => void;
  onLoadMergePreview: () => void;
  onStageOnlyChange: (value: boolean) => void;
  onMerge: () => void;
  onStashAndMerge?: () => void;
}

/**
 * Displays the workspace status including change summary, merge preview, and action buttons
 */
export function WorkspaceStatus({
  task,
  worktreeStatus,
  workspaceError,
  stageOnly,
  mergePreview,
  isLoadingPreview,
  isMerging,
  isDiscarding,
  onShowDiffDialog,
  onShowDiscardDialog,
  onShowConflictDialog,
  onLoadMergePreview,
  onStageOnlyChange,
  onMerge,
  onStashAndMerge
}: WorkspaceStatusProps) {
  const { t } = useTranslation(['common', 'taskDetail', 'worktrees']);
  const [isStashingAndMerging, setIsStashingAndMerging] = useState(false);

  const { openTerminal, error: terminalError, isOpening } = useTerminalHandler();
  const hasGitConflicts = mergePreview?.gitConflicts?.hasConflicts;
  const hasUncommittedChanges = mergePreview?.uncommittedChanges?.hasChanges;
  const uncommittedCount = mergePreview?.uncommittedChanges?.count || 0;
  const hasAIConflicts = mergePreview && mergePreview.conflicts.length > 0;

  // Determine overall status
  const statusColor = hasGitConflicts
    ? 'warning'
    : hasUncommittedChanges
      ? 'warning'
      : mergePreview && !hasAIConflicts
        ? 'success'
        : 'info';

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header with stats */}
      <div className="px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm text-foreground flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-purple-400" />
            {t('taskDetail:review.header')}
          </h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShowDiffDialog(true)}
              className="h-7 px-2 text-xs"
            >
              <Eye className="h-3.5 w-3.5 mr-1" />{t("common:buttons.view")}</Button>
            {worktreeStatus.worktreePath && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openTerminal(`open-${task.id}`, worktreeStatus.worktreePath!)}
                className="h-7 px-2"
                title={t('taskDetail:review.openTerminal')}
                disabled={isOpening}
              >
                <Terminal className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Compact stats row */}
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <FileCode className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">{worktreeStatus.filesChanged || 0}</span> {t('taskDetail:review.files')}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <GitCommit className="h-3.5 w-3.5" />
            <span className="font-medium text-foreground">{worktreeStatus.commitCount || 0}</span> {t('taskDetail:review.commits')}
          </span>
          <span className="flex items-center gap-1 text-success">
            <Plus className="h-3.5 w-3.5" />
            <span className="font-medium">{worktreeStatus.additions || 0}</span>
          </span>
          <span className="flex items-center gap-1 text-destructive">
            <Minus className="h-3.5 w-3.5" />
            <span className="font-medium">{worktreeStatus.deletions || 0}</span>
          </span>
        </div>

        {/* Branch info */}
        {worktreeStatus.branch && (
          <div className="mt-2 text-xs text-muted-foreground">
            <code className="bg-background/80 px-1.5 py-0.5 rounded text-[11px]">{worktreeStatus.branch}</code>
            <span className="mx-1.5">→</span>
            <code className="bg-background/80 px-1.5 py-0.5 rounded text-[11px]">{worktreeStatus.baseBranch || 'main'}</code>
          </div>
        )}

        {/* Worktree path display */}
        {worktreeStatus.worktreePath && (
          <div className="mt-2 text-xs text-muted-foreground font-mono">
            📁 {worktreeStatus.worktreePath}
          </div>
        )}

        {/* Terminal error display */}
        {terminalError && (
          <div className="mt-2 text-sm text-red-600">
            {terminalError}
          </div>
        )}
      </div>

      {/* Status/Warnings Section */}
      <div className="px-4 py-3 space-y-3">
        {/* Workspace Error */}
        {workspaceError && (
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">{workspaceError}</p>
          </div>
        )}

        {/* Uncommitted Changes Warning with Stash & Merge Option */}
        {hasUncommittedChanges && (
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-warning">
                  {t('worktrees:mergeDialog.uncommittedChanges')}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('worktrees:mergeDialog.uncommittedChangesDesc')}
                </p>
                {/* List of uncommitted files */}
                {mergePreview?.uncommittedChanges?.files && mergePreview.uncommittedChanges.files.length > 0 && (
                  <div className="mt-2 text-xs font-mono text-muted-foreground max-h-20 overflow-y-auto">
                    {mergePreview.uncommittedChanges.files.slice(0, 5).map((file, idx) => (
                      <div key={idx} className="truncate">• {file}</div>
                    ))}
                    {mergePreview.uncommittedChanges.files.length > 5 && (
                      <div className="text-muted-foreground/60">... {t('common:and')} {mergePreview.uncommittedChanges.files.length - 5} {t('common:more')}</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Resolution Options */}
            <div className="flex flex-wrap gap-2 mt-1 ml-6">
              {onStashAndMerge && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    setIsStashingAndMerging(true);
                    try {
                      await onStashAndMerge();
                    } finally {
                      setIsStashingAndMerging(false);
                    }
                  }}
                  className="text-xs h-7 bg-warning/20 hover:bg-warning/30 border-warning/40"
                  disabled={isStashingAndMerging || isMerging}
                >
                  {isStashingAndMerging ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      {t('worktrees:mergeDialog.merging')}
                    </>
                  ) : (
                    <>
                      <Package className="h-3 w-3 mr-1" />
                      {t('worktrees:mergeDialog.stashAndMerge')}
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const mainProjectPath = worktreeStatus.worktreePath?.replace('.worktrees/' + task.specId, '') || '';
                  if (mainProjectPath) {
                    openTerminal(`stash-${task.id}`, mainProjectPath);
                  }
                }}
                className="text-xs h-7"
                disabled={isOpening}
              >
                <Terminal className="h-3 w-3 mr-1" />
                {t('worktrees:mergeDialog.manualResolve')}
              </Button>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoadingPreview && !mergePreview && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('taskDetail:review.checkingConflicts')}
          </div>
        )}

        {/* Merge Status */}
        {mergePreview && (
          <div className={cn(
            "flex items-center justify-between p-2.5 rounded-lg border",
            hasGitConflicts
              ? "bg-warning/10 border-warning/20"
              : !hasAIConflicts
                ? "bg-success/10 border-success/20"
                : "bg-warning/10 border-warning/20"
          )}>
            <div className="flex items-center gap-2">
              {hasGitConflicts ? (
                <>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <div>
                    <span className="text-sm font-medium text-warning">{t('taskDetail:review.branchDiverged')}</span>
                    <span className="text-xs text-muted-foreground ml-2">{t('taskDetail:review.aiWillResolve')}</span>
                  </div>
                </>
              ) : !hasAIConflicts ? (
                <>
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm font-medium text-success">{t('taskDetail:review.readyToMerge')}</span>
                  <span className="text-xs text-muted-foreground ml-1">
                    {mergePreview.summary.totalFiles} {t('taskDetail:review.files')}
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-sm font-medium text-warning">
                    {t('taskDetail:review.conflicts', { count: mergePreview.conflicts.length })}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {(hasGitConflicts || hasAIConflicts) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShowConflictDialog(true)}
                  className="h-7 text-xs"
                >
                  {t('taskDetail:review.actions.details')}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onLoadMergePreview}
                disabled={isLoadingPreview}
                className="h-7 px-2"
                title={t("common:buttons.refresh")}
              >
                {isLoadingPreview ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Git Conflicts Details */}
        {hasGitConflicts && mergePreview?.gitConflicts && (
          <div className="text-xs text-muted-foreground pl-6">
            {t('taskDetail:review.mainBranchUpdates', { count: mergePreview.gitConflicts.commitsBehind })}
            {mergePreview.gitConflicts.conflictingFiles.length > 0 && (
              <span className="text-warning">
                {' '}{t('taskDetail:review.mergingNeeded', { count: mergePreview.gitConflicts.conflictingFiles.length })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="px-4 py-3 bg-muted/20 border-t border-border space-y-3">
        {/* Stage Only Option */}
        <label className="inline-flex items-center gap-2.5 text-sm cursor-pointer select-none px-3 py-2 rounded-lg border border-border bg-background/50 hover:bg-background/80 transition-colors">
          <Checkbox
            checked={stageOnly}
            onCheckedChange={(checked) => onStageOnlyChange(checked === true)}
            className="border-muted-foreground/50 data-[state=checked]:border-primary"
          />
          <span className={cn(
            "transition-colors",
            stageOnly ? "text-foreground" : "text-muted-foreground"
          )}>{t('taskDetail:review.stageOnly')}</span>
        </label>

        {/* Primary Actions */}
        <div className="flex gap-2">
          <Button
            variant={hasGitConflicts ? "warning" : "success"}
            onClick={onMerge}
            disabled={isMerging || isDiscarding}
            className="flex-1"
          >
            {isMerging ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {hasGitConflicts ? t('taskDetail:review.actions.resolving') : stageOnly ? t('taskDetail:review.actions.staging') : t('taskDetail:review.actions.merging')}
              </>
            ) : (
              <>
                <GitMerge className="mr-2 h-4 w-4" />
                {hasGitConflicts
                  ? (stageOnly ? t('taskDetail:review.actions.stageWithAI') : t('taskDetail:review.actions.mergeWithAI'))
                  : (stageOnly ? t('taskDetail:review.actions.stageChanges') : t('taskDetail:review.actions.mergeToMain'))}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onShowDiscardDialog(true)}
            disabled={isMerging || isDiscarding}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30"
            title={t('taskDetail:review.actions.discardBuild')}
          >
            <FolderX className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
