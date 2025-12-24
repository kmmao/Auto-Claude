import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import English translation resources
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enSettings from './locales/en/settings.json';
import enTasks from './locales/en/tasks.json';
import enWelcome from './locales/en/welcome.json';
import enOnboarding from './locales/en/onboarding.json';
import enDialogs from './locales/en/dialogs.json';
import enSidebar from './locales/en/sidebar.json';
import enKanban from './locales/en/kanban.json';
import enTerminal from './locales/en/terminal.json';
import enRoadmap from './locales/en/roadmap.json';
import enInsights from './locales/en/insights.json';
import enIdeation from './locales/en/ideation.json';
import enContext from './locales/en/context.json';
import enChangelog from './locales/en/changelog.json';
import enGithub from './locales/en/github.json';
import enWorktrees from './locales/en/worktrees.json';
import enTaskDetail from './locales/en/task-detail.json';
import enErrors from './locales/en/errors.json';

// Import French translation resources
import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frSettings from './locales/fr/settings.json';
import frTasks from './locales/fr/tasks.json';
import frWelcome from './locales/fr/welcome.json';
import frOnboarding from './locales/fr/onboarding.json';
import frDialogs from './locales/fr/dialogs.json';
import frSidebar from './locales/fr/sidebar.json';
import frKanban from './locales/fr/kanban.json';
import frTerminal from './locales/fr/terminal.json';
import frRoadmap from './locales/fr/roadmap.json';
import frInsights from './locales/fr/insights.json';
import frIdeation from './locales/fr/ideation.json';
import frContext from './locales/fr/context.json';
import frChangelog from './locales/fr/changelog.json';
import frGithub from './locales/fr/github.json';
import frWorktrees from './locales/fr/worktrees.json';
import frTaskDetail from './locales/fr/task-detail.json';
import frErrors from './locales/fr/errors.json';

// Import Chinese (Simplified) translation resources
import zhCNCommon from './locales/zh-CN/common.json';
import zhCNNavigation from './locales/zh-CN/navigation.json';
import zhCNSettings from './locales/zh-CN/settings.json';
import zhCNTasks from './locales/zh-CN/tasks.json';
import zhCNWelcome from './locales/zh-CN/welcome.json';
import zhCNOnboarding from './locales/zh-CN/onboarding.json';
import zhCNDialogs from './locales/zh-CN/dialogs.json';
import zhCNSidebar from './locales/zh-CN/sidebar.json';
import zhCNKanban from './locales/zh-CN/kanban.json';
import zhCNTerminal from './locales/zh-CN/terminal.json';
import zhCNRoadmap from './locales/zh-CN/roadmap.json';
import zhCNInsights from './locales/zh-CN/insights.json';
import zhCNIdeation from './locales/zh-CN/ideation.json';
import zhCNContext from './locales/zh-CN/context.json';
import zhCNChangelog from './locales/zh-CN/changelog.json';
import zhCNGithub from './locales/zh-CN/github.json';
import zhCNWorktrees from './locales/zh-CN/worktrees.json';
import zhCNTaskDetail from './locales/zh-CN/task-detail.json';
import zhCNErrors from './locales/zh-CN/errors.json';

export const defaultNS = 'common';

export const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    settings: enSettings,
    tasks: enTasks,
    welcome: enWelcome,
    onboarding: enOnboarding,
    dialogs: enDialogs,
    sidebar: enSidebar,
    kanban: enKanban,
    terminal: enTerminal,
    roadmap: enRoadmap,
    insights: enInsights,
    ideation: enIdeation,
    context: enContext,
    changelog: enChangelog,
    github: enGithub,
    worktrees: enWorktrees,
    taskDetail: enTaskDetail,
    errors: enErrors
  },
  fr: {
    common: frCommon,
    navigation: frNavigation,
    settings: frSettings,
    tasks: frTasks,
    welcome: frWelcome,
    onboarding: frOnboarding,
    dialogs: frDialogs,
    sidebar: frSidebar,
    kanban: frKanban,
    terminal: frTerminal,
    roadmap: frRoadmap,
    insights: frInsights,
    ideation: frIdeation,
    context: frContext,
    changelog: frChangelog,
    github: frGithub,
    worktrees: frWorktrees,
    taskDetail: frTaskDetail,
    errors: frErrors
  },
  'zh-CN': {
    common: zhCNCommon,
    navigation: zhCNNavigation,
    settings: zhCNSettings,
    tasks: zhCNTasks,
    welcome: zhCNWelcome,
    onboarding: zhCNOnboarding,
    dialogs: zhCNDialogs,
    sidebar: zhCNSidebar,
    kanban: zhCNKanban,
    terminal: zhCNTerminal,
    roadmap: zhCNRoadmap,
    insights: zhCNInsights,
    ideation: zhCNIdeation,
    context: zhCNContext,
    changelog: zhCNChangelog,
    github: zhCNGithub,
    worktrees: zhCNWorktrees,
    taskDetail: zhCNTaskDetail,
    errors: zhCNErrors
  }
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language (will be overridden by settings)
    fallbackLng: 'en',
    defaultNS,
    ns: ['common', 'navigation', 'settings', 'tasks', 'welcome', 'onboarding', 'dialogs',
      'sidebar', 'kanban', 'terminal', 'roadmap', 'insights', 'ideation', 'context',
      'changelog', 'github', 'worktrees', 'taskDetail', 'errors'],
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false // Disable suspense for Electron compatibility
    }
  });

export default i18n;
