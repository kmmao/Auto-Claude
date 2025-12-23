import { RefreshCw, AlertCircle, FolderTree } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';
import { ServiceCard } from './ServiceCard';
import { InfoItem } from './InfoItem';
import type { ProjectIndex } from '../../../shared/types';
import { useTranslation } from 'react-i18next';

interface ProjectIndexTabProps {
  projectIndex: ProjectIndex | null;
  indexLoading: boolean;
  indexError: string | null;
  onRefresh: () => void;
}

export function ProjectIndexTab({
  projectIndex,
  indexLoading,
  indexError,
  onRefresh
}: ProjectIndexTabProps) {
  const { t } = useTranslation(['common', 'context']);

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header with refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{t('context:projectIndex.title')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('context:projectIndex.description')}
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={indexLoading}
              >
                <RefreshCw className={cn('h-4 w-4 mr-2', indexLoading && 'animate-spin')} />{t("common:buttons.refresh")}</Button>
            </TooltipTrigger>
            <TooltipContent>{t('context:projectIndex.tooltip.reanalyze')}</TooltipContent>
          </Tooltip>
        </div>

        {/* Error state */}
        {indexError && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-medium">{t('context:projectIndex.error.loadFailed')}</p>
              <p className="text-sm opacity-80">{indexError}</p>
            </div>
          </div>
        )}

        {/* Loading state */}
        {indexLoading && !projectIndex && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* No index state */}
        {!indexLoading && !projectIndex && !indexError && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderTree className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground">{t('context:projectIndex.emptyState.title')}</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              {t('context:projectIndex.emptyState.description')}
            </p>
            <Button onClick={onRefresh} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('context:projectIndex.emptyState.action')}
            </Button>
          </div>
        )}

        {/* Project index content */}
        {projectIndex && (
          <div className="space-y-6">
            {/* Project Overview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{t('context:projectIndex.overview.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {projectIndex.project_type}
                  </Badge>
                  {Object.keys(projectIndex.services).length > 0 && (
                    <Badge variant="secondary">
                      {t('context:projectIndex.overview.services', { count: Object.keys(projectIndex.services).length })}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-mono truncate">
                  {projectIndex.project_root}
                </p>
              </CardContent>
            </Card>

            {/* Services */}
            {Object.keys(projectIndex.services).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('context:projectIndex.sections.services')}
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(projectIndex.services).map(([name, service]) => (
                    <ServiceCard key={name} name={name} service={service} />
                  ))}
                </div>
              </div>
            )}

            {/* Infrastructure */}
            {Object.keys(projectIndex.infrastructure).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('context:projectIndex.sections.infrastructure')}
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {projectIndex.infrastructure.docker_compose && (
                        <InfoItem label={t('context:projectIndex.labels.dockerCompose')} value={projectIndex.infrastructure.docker_compose} />
                      )}
                      {projectIndex.infrastructure.ci && (
                        <InfoItem label={t('context:projectIndex.labels.ci')} value={projectIndex.infrastructure.ci} />
                      )}
                      {projectIndex.infrastructure.deployment && (
                        <InfoItem label={t('context:projectIndex.labels.deployment')} value={projectIndex.infrastructure.deployment} />
                      )}
                      {projectIndex.infrastructure.docker_services &&
                        projectIndex.infrastructure.docker_services.length > 0 && (
                          <div className="sm:col-span-2">
                            <span className="text-xs text-muted-foreground">{t('context:projectIndex.labels.dockerServices')}</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {projectIndex.infrastructure.docker_services.map((svc) => (
                                <Badge key={svc} variant="secondary" className="text-xs">
                                  {svc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Conventions */}
            {Object.keys(projectIndex.conventions).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('context:projectIndex.sections.conventions')}
                </h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {projectIndex.conventions.python_linting && (
                        <InfoItem label={t('context:projectIndex.labels.pythonLinting')} value={projectIndex.conventions.python_linting} />
                      )}
                      {projectIndex.conventions.js_linting && (
                        <InfoItem label={t('context:projectIndex.labels.jsLinting')} value={projectIndex.conventions.js_linting} />
                      )}
                      {projectIndex.conventions.formatting && (
                        <InfoItem label={t('context:projectIndex.labels.formatting')} value={projectIndex.conventions.formatting} />
                      )}
                      {projectIndex.conventions.git_hooks && (
                        <InfoItem label={t('context:projectIndex.labels.gitHooks')} value={projectIndex.conventions.git_hooks} />
                      )}
                      {projectIndex.conventions.typescript && (
                        <InfoItem label={t('context:projectIndex.labels.typescript')} value={t('context:projectIndex.labels.enabled')} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
