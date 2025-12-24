import { ListTodo, Plus, X, ChevronDown, Loader2 } from 'lucide-react';
import type { Task } from '../../../shared/types';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';
import { PHASE_CONFIG } from './types';

interface TaskSelectorProps {
  terminalId: string;
  backlogTasks: Task[];
  associatedTask?: Task;
  onTaskSelect: (taskId: string) => void;
  onClearTask: () => void;
  onNewTaskClick?: () => void;
}

export function TaskSelector({
  terminalId: _terminalId,
  backlogTasks,
  associatedTask,
  onTaskSelect,
  onClearTask,
  onNewTaskClick,
}: TaskSelectorProps) {
  const { t } = useTranslation(['common', 'terminal']);

  const executionPhase = associatedTask?.executionProgress?.phase || 'idle';
  const phaseConfig = PHASE_CONFIG[executionPhase];
  const PhaseIcon = phaseConfig.icon;

  if (associatedTask) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex items-center gap-1.5 h-6 px-2 rounded text-[10px] font-medium transition-colors',
              phaseConfig.color,
              'hover:opacity-80 cursor-pointer'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {executionPhase === 'planning' || executionPhase === 'coding' || executionPhase === 'qa_review' || executionPhase === 'qa_fixing' ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <PhaseIcon className="h-3 w-3" />
            )}
            <span>{phaseConfig.label}</span>
            <ChevronDown className="h-2.5 w-2.5 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            {t('terminal:taskSelector.currentTask')}
          </div>
          <div className="px-2 py-1 text-sm font-medium truncate">
            {associatedTask.title}
          </div>
          {associatedTask.executionProgress?.message && (
            <div className="px-2 py-1 text-xs text-muted-foreground truncate">
              {associatedTask.executionProgress.message}
            </div>
          )}
          <DropdownMenuSeparator />
          {backlogTasks.length > 0 && (
            <>
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                {t('terminal:taskSelector.switchTo')}
              </div>
              {backlogTasks.filter(t => t.id !== associatedTask.id).slice(0, 5).map((task) => (
                <DropdownMenuItem
                  key={task.id}
                  onClick={() => onTaskSelect(task.id)}
                  className="text-xs"
                >
                  <ListTodo className="h-3 w-3 mr-2 text-muted-foreground" />
                  <span className="truncate">{task.title}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            onClick={onClearTask}
            className="text-xs text-muted-foreground"
          >
            <X className="h-3 w-3 mr-2" />
            {t('terminal:taskSelector.clearTask')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-1.5 h-6 px-2 rounded text-[10px] font-medium transition-colors border border-border/50 bg-card/50 hover:bg-card hover:border-border text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <ListTodo className="h-3 w-3" />
          <span>{t('terminal:taskSelector.selectTask')}</span>
          <ChevronDown className="h-2.5 w-2.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {backlogTasks.length > 0 ? (
          <>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {t('terminal:taskSelector.availableTasks')}
            </div>
            {backlogTasks.slice(0, 8).map((task) => (
              <DropdownMenuItem
                key={task.id}
                onClick={() => onTaskSelect(task.id)}
                className="text-xs"
              >
                <ListTodo className="h-3 w-3 mr-2 text-muted-foreground" />
                <span className="truncate">{task.title}</span>
              </DropdownMenuItem>
            ))}
            {onNewTaskClick && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onNewTaskClick();
                  }}
                  className="text-xs text-primary"
                >
                  <Plus className="h-3 w-3 mr-2" />
                  {t('terminal:taskSelector.addNewTask')}
                </DropdownMenuItem>
              </>
            )}
          </>
        ) : (
          <>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              {t('terminal:taskSelector.noTasksAvailable')}
            </div>
            {onNewTaskClick ? (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onNewTaskClick();
                }}
                className="text-xs text-primary"
              >
                <Plus className="h-3 w-3 mr-2" />
                {t('terminal:taskSelector.addNewTask')}
              </DropdownMenuItem>
            ) : (
              <div className="px-2 py-1.5 text-xs text-muted-foreground italic">
                {t('terminal:taskSelector.createTasksHint')}
              </div>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
