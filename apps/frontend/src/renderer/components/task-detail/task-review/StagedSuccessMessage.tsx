import { useState } from 'react';
import { GitMerge, ExternalLink, Copy, Check, Sparkles } from 'lucide-react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import type { Task } from '../../../../shared/types';
import { useTerminalHandler } from '../hooks/useTerminalHandler';
import { useTranslation, Trans } from 'react-i18next';

interface StagedSuccessMessageProps {
  stagedSuccess: string;
  stagedProjectPath: string | undefined;
  task: Task;
  suggestedCommitMessage?: string;
}

/**
 * Displays success message after changes have been staged in the main project
 */
export function StagedSuccessMessage({
  stagedSuccess,
  stagedProjectPath,
  task,
  suggestedCommitMessage
}: StagedSuccessMessageProps) {
  const { t } = useTranslation(['common', 'taskDetail']);

  const [commitMessage, setCommitMessage] = useState(suggestedCommitMessage || '');
  const [copied, setCopied] = useState(false);
  const { openTerminal, error: terminalError, isOpening } = useTerminalHandler();

  const handleCopy = async () => {
    if (!commitMessage) return;
    try {
      await navigator.clipboard.writeText(commitMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="rounded-xl border border-success/30 bg-success/10 p-4">
      <h3 className="font-medium text-sm text-foreground mb-2 flex items-center gap-2">
        <GitMerge className="h-4 w-4 text-success" />
        {t('taskDetail:review.stagedSuccess.title')}
      </h3>
      <p className="text-sm text-muted-foreground mb-3">
        {stagedSuccess}
      </p>

      {/* Commit Message Section */}
      {suggestedCommitMessage && (
        <div className="bg-background/50 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-purple-400" />
              {t('taskDetail:review.stagedSuccess.commitTitle')}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-2 text-xs"
              disabled={!commitMessage}
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-success" />
                  {t('taskDetail:review.stagedSuccess.copied')}
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  {t('taskDetail:review.stagedSuccess.copy')}
                </>
              )}
            </Button>
          </div>
          <Textarea
            value={commitMessage}
            onChange={(e) => setCommitMessage(e.target.value)}
            className="font-mono text-xs min-h-[100px] bg-background/80 resize-y"
            placeholder={t('taskDetail:review.stagedSuccess.pendingMessage')}
          />
          <p className="text-[10px] text-muted-foreground mt-1.5">
            <Trans
              i18nKey="taskDetail:review.stagedSuccess.editAndCopy"
              values={{ cmd: 'git commit -m "..."' }}
              components={{ code: <code className="bg-background px-1 rounded" /> }}
            />
          </p>
        </div>
      )}

      <div className="bg-background/50 rounded-lg p-3 mb-3">
        <p className="text-xs text-muted-foreground mb-2">{t('taskDetail:review.stagedSuccess.nextSteps')}</p>
        <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
          <li>{t('taskDetail:review.stagedSuccess.step1')}</li>
          <li>
            <Trans
              i18nKey="taskDetail:review.stagedSuccess.step2"
              values={{ status: 'git status', diff: 'git diff --staged' }}
              components={{ code: <code className="bg-background px-1 rounded" /> }}
            />
          </li>
          <li>
            <Trans
              i18nKey="taskDetail:review.stagedSuccess.step3"
              values={{ cmd: 'git commit -m "your message"' }}
              components={{ code: <code className="bg-background px-1 rounded" /> }}
            />
          </li>
        </ol>
      </div>
      {stagedProjectPath && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openTerminal(`project-${task.id}`, stagedProjectPath)}
            className="w-full"
            disabled={isOpening}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            {isOpening ? t('taskDetail:review.stagedSuccess.openingTerminal') : t('taskDetail:review.stagedSuccess.openTerminal')}
          </Button>
          {terminalError && (
            <div className="mt-2 text-sm text-red-600">
              {terminalError}
            </div>
          )}
        </>
      )}
    </div>
  );
}
