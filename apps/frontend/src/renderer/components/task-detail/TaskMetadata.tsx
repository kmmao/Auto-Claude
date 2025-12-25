import {
  Target,
  Bug,
  Wrench,
  FileCode,
  Shield,
  Gauge,
  Palette,
  Lightbulb,
  Users,
  GitBranch,
  ListChecks,
  Clock
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn, formatRelativeTime, sanitizeMarkdownForDisplay } from '../../lib/utils';
import {
  TASK_CATEGORY_COLORS,
  TASK_COMPLEXITY_COLORS,
  TASK_IMPACT_COLORS,
  TASK_PRIORITY_COLORS
} from '../../../shared/constants';
import type { Task, TaskCategory } from '../../../shared/types';

// Category icon mapping
const CategoryIcon: Record<TaskCategory, typeof Target> = {
  feature: Target,
  bug_fix: Bug,
  refactoring: Wrench,
  documentation: FileCode,
  security: Shield,
  performance: Gauge,
  ui_ux: Palette,
  infrastructure: Wrench,
  testing: FileCode
};

interface TaskMetadataProps {
  task: Task;
}

export function TaskMetadata({ task }: TaskMetadataProps) {
  const { t } = useTranslation(['common', 'taskDetail', 'ideation']);

  const hasClassification = task.metadata && (
    task.metadata.category ||
    task.metadata.priority ||
    task.metadata.complexity ||
    task.metadata.impact ||
    task.metadata.securitySeverity ||
    task.metadata.sourceType
  );

  return (
    <div className="space-y-5">
      {/* Compact Metadata Bar: Classification + Timeline */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
        {/* Classification Badges - Left */}
        {hasClassification && (
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category */}
            {task.metadata?.category && (
              <Badge
                variant="outline"
                className={cn('text-xs', TASK_CATEGORY_COLORS[task.metadata.category])}
              >
                {CategoryIcon[task.metadata.category] && (() => {
                  const Icon = CategoryIcon[task.metadata.category!];
                  return <Icon className="h-3 w-3 mr-1" />;
                })()}
                {t(`taskDetail:labels.${task.metadata.category}`)}
              </Badge>
            )}
            {/* Priority */}
            {task.metadata?.priority && (
              <Badge
                variant="outline"
                className={cn('text-xs', TASK_PRIORITY_COLORS[task.metadata.priority])}
              >
                {t(`taskDetail:labels.${task.metadata.priority}`)}
              </Badge>
            )}
            {/* Complexity */}
            {task.metadata?.complexity && (
              <Badge
                variant="outline"
                className={cn('text-xs', TASK_COMPLEXITY_COLORS[task.metadata.complexity])}
              >
                {t(`taskDetail:labels.${task.metadata.complexity}`)}
              </Badge>
            )}
            {/* Impact */}
            {task.metadata?.impact && (
              <Badge
                variant="outline"
                className={cn('text-xs', TASK_IMPACT_COLORS[task.metadata.impact])}
              >
                {t(`taskDetail:labels.${task.metadata.impact}`)}
              </Badge>
            )}
            {/* Security Severity */}
            {task.metadata?.securitySeverity && (
              <Badge
                variant="outline"
                className={cn('text-xs', TASK_IMPACT_COLORS[task.metadata.securitySeverity])}
              >
                <Shield className="h-3 w-3 mr-1" />
                {t(`taskDetail:metadata.securitySeverity`)}: {task.metadata.securitySeverity}
              </Badge>
            )}
            {/* Source Type */}
            {task.metadata?.sourceType && (
              <Badge variant="secondary" className="text-xs">
                {task.metadata.sourceType === 'ideation' && task.metadata.ideationType
                  ? t(`ideation:types.${task.metadata.ideationType}.label`, { defaultValue: task.metadata.ideationType })
                  : t(`taskDetail:sourceType.${task.metadata.sourceType}`)}
              </Badge>
            )}
          </div>
        )}

        {/* Timeline - Right */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {t('taskDetail:metadata.created')} {formatRelativeTime(task.createdAt)}
          </span>
          <span className="text-border">•</span>
          <span>{t('taskDetail:metadata.updated')} {formatRelativeTime(task.updatedAt)}</span>
        </div>
      </div>

      {/* Description - Primary Content */}
      {task.description && (
        <div>
          <p className="text-sm text-foreground/90 leading-relaxed">
            {sanitizeMarkdownForDisplay(task.description, 800)}
          </p>
        </div>
      )}

      {/* Secondary Details */}
      {task.metadata && (
        <div className="space-y-4 pt-2">
          {/* Rationale */}
          {task.metadata.rationale && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="h-3 w-3 text-warning" />
                {t('taskDetail:metadata.rationale')}
              </h3>
              <p className="text-sm text-foreground/80">{task.metadata.rationale}</p>
            </div>
          )}

          {/* Problem Solved */}
          {task.metadata.problemSolved && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Target className="h-3 w-3 text-success" />
                {t('taskDetail:metadata.problemSolved')}
              </h3>
              <p className="text-sm text-foreground/80">{task.metadata.problemSolved}</p>
            </div>
          )}

          {/* Target Audience */}
          {task.metadata.targetAudience && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <Users className="h-3 w-3 text-info" />
                {t('taskDetail:metadata.targetAudience')}
              </h3>
              <p className="text-sm text-foreground/80">{task.metadata.targetAudience}</p>
            </div>
          )}

          {/* Dependencies */}
          {task.metadata.dependencies && task.metadata.dependencies.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <GitBranch className="h-3 w-3 text-purple-400" />
                {t('taskDetail:metadata.dependencies')}
              </h3>
              <ul className="text-sm text-foreground/80 list-disc list-inside space-y-0.5">
                {task.metadata.dependencies.map((dep, idx) => (
                  <li key={idx}>{dep}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Acceptance Criteria */}
          {task.metadata.acceptanceCriteria && task.metadata.acceptanceCriteria.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <ListChecks className="h-3 w-3 text-success" />
                {t('taskDetail:metadata.acceptanceCriteria')}
              </h3>
              <ul className="text-sm text-foreground/80 list-disc list-inside space-y-0.5">
                {task.metadata.acceptanceCriteria.map((criteria, idx) => (
                  <li key={idx}>{criteria}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Affected Files */}
          {task.metadata.affectedFiles && task.metadata.affectedFiles.length > 0 && (
            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <FileCode className="h-3 w-3" />
                {t('taskDetail:metadata.affectedFiles')}
              </h3>
              <div className="flex flex-wrap gap-1">
                {task.metadata.affectedFiles.map((file, idx) => (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="text-xs font-mono cursor-help">
                        {file.split('/').pop()}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="font-mono text-xs">
                      {file}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
