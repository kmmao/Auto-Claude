import {
  CheckCircle2,
  Settings,
  PlusCircle,
  HelpCircle,
  Wand2,
  Zap,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

interface CompletionStepProps {
  onFinish: () => void;
  onOpenTaskCreator?: () => void;
  onOpenSettings?: () => void;
}

interface NextStepCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

function NextStepCard({ icon, title, description, onClick }: NextStepCardProps) {
  return (
    <Card
      className={cn(
        "border border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:bg-primary/5 cursor-pointer group",
        !onClick && "cursor-default hover:border-border hover:bg-card/50"
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
          </div>
          {onClick && (
            <div className="pt-2">
              <div className="text-xs font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {title.includes('Task') || title.includes('任务') ? 'Create Now' : 'Open'}
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Completion step component for the onboarding wizard.
 * Displays a success message with suggestions for next steps
 * and a prominent {t("common:buttons.finish")} button to complete the wizard.
 */
export function CompletionStep({ onFinish, onOpenTaskCreator, onOpenSettings }: CompletionStepProps) {
  const { t } = useTranslation(['common', 'onboarding']);

  const nextSteps = [
    {
      icon: <PlusCircle className="h-5 w-5 text-primary" />,
      title: t('onboarding:completion.nextSteps.task.title'),
      description: t('onboarding:completion.nextSteps.task.description'),
      onClick: onOpenTaskCreator
    },
    {
      icon: <Settings className="h-5 w-5 text-primary" />,
      title: t('onboarding:completion.nextSteps.settings.title'),
      description: t('onboarding:completion.nextSteps.settings.description'),
      onClick: onOpenSettings
    },
    {
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      title: t('onboarding:completion.nextSteps.docs.title'),
      description: t('onboarding:completion.nextSteps.docs.description'),
      onClick: () => window.electronAPI.openExternal('https://github.com/kmmao/Auto-Claude')
    }
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 py-6">
      <div className="w-full max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success animate-in zoom-in duration-500">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-success text-success animate-bounce">
                  <Wand2 className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            {t('onboarding:completion.title')}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            {t('onboarding:completion.subtitle')}
          </p>
        </div>

        {/* Success Card */}
        <Card className="border-success/20 bg-success/5 mb-10 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-success/20 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {t('onboarding:completion.success.card')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('onboarding:completion.success.ready')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps Grid */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-1">
            {t('onboarding:completion.nextSteps.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nextSteps.map((step, index) => (
              <NextStepCard
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                onClick={step.onClick}
              />
            ))}
          </div>
        </div>

        {/* Primary Action */}
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={onFinish}
            className="w-full sm:w-auto px-12 h-12 text-lg font-semibold group"
          >
            {t('onboarding:completion.actions.finish')}
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground">
            <Trans
              i18nKey="onboarding:completion.actions.rerun"
              components={{
                1: <span className="font-semibold" />
              }}
            />
          </p>
        </div>
      </div>
    </div>
  );
}
