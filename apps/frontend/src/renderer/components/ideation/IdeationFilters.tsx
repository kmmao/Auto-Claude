import { Zap, Palette, BookOpen, Shield, Gauge } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { useTranslation } from 'react-i18next';

interface IdeationFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export function IdeationFilters({ activeTab, onTabChange, children }: IdeationFiltersProps) {
  const { t } = useTranslation(['common', 'ideation']);

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="h-full flex flex-col">
      <TabsList className="shrink-0 mx-4 mt-4 flex-wrap h-auto gap-1">
        <TabsTrigger value="all">{t('ideation:filters.all')}</TabsTrigger>
        <TabsTrigger value="code_improvements">
          <Zap className="h-3 w-3 mr-1" />
          {t('ideation:filters.code')}
        </TabsTrigger>
        <TabsTrigger value="ui_ux_improvements">
          <Palette className="h-3 w-3 mr-1" />
          {t('ideation:filters.ui')}
        </TabsTrigger>
        <TabsTrigger value="documentation_gaps">
          <BookOpen className="h-3 w-3 mr-1" />
          {t('ideation:filters.docs')}
        </TabsTrigger>
        <TabsTrigger value="security_hardening">
          <Shield className="h-3 w-3 mr-1" />
          {t('ideation:filters.security')}
        </TabsTrigger>
        <TabsTrigger value="performance_optimizations">
          <Gauge className="h-3 w-3 mr-1" />
          {t('ideation:filters.performance')}
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}
