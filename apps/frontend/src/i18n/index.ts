import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enSidebar from './locales/en/sidebar.json';
import enSettings from './locales/en/settings.json';
import enTasks from './locales/en/tasks.json';
import enTerminal from './locales/en/terminal.json';
import enRoadmap from './locales/en/roadmap.json';
import enInsights from './locales/en/insights.json';
import enTaskDetail from './locales/en/task-detail.json';
import enIdeation from './locales/en/ideation.json';
import enContext from './locales/en/context.json';
import enChangelog from './locales/en/changelog.json';
import enGithub from './locales/en/github.json';
import enWorktrees from './locales/en/worktrees.json';
import enOnboarding from './locales/en/onboarding.json';
import enErrors from './locales/en/errors.json';
import enKanban from './locales/en/kanban.json';

import zhCommon from './locales/zh-CN/common.json';
import zhSidebar from './locales/zh-CN/sidebar.json';
import zhSettings from './locales/zh-CN/settings.json';
import zhTasks from './locales/zh-CN/tasks.json';
import zhTerminal from './locales/zh-CN/terminal.json';
import zhRoadmap from './locales/zh-CN/roadmap.json';
import zhInsights from './locales/zh-CN/insights.json';
import zhTaskDetail from './locales/zh-CN/task-detail.json';
import zhIdeation from './locales/zh-CN/ideation.json';
import zhContext from './locales/zh-CN/context.json';
import zhChangelog from './locales/zh-CN/changelog.json';
import zhGithub from './locales/zh-CN/github.json';
import zhWorktrees from './locales/zh-CN/worktrees.json';
import zhOnboarding from './locales/zh-CN/onboarding.json';
import zhErrors from './locales/zh-CN/errors.json';
import zhKanban from './locales/zh-CN/kanban.json';

const resources = {
    en: {
        common: enCommon,
        sidebar: enSidebar,
        settings: enSettings,
        tasks: enTasks,
        terminal: enTerminal,
        roadmap: enRoadmap,
        insights: enInsights,
        taskDetail: enTaskDetail,
        ideation: enIdeation,
        context: enContext,
        changelog: enChangelog,
        github: enGithub,
        worktrees: enWorktrees,
        onboarding: enOnboarding,
        errors: enErrors,
        kanban: enKanban,
    },
    'zh-CN': {
        common: zhCommon,
        sidebar: zhSidebar,
        settings: zhSettings,
        tasks: zhTasks,
        terminal: zhTerminal,
        roadmap: zhRoadmap,
        insights: zhInsights,
        taskDetail: zhTaskDetail,
        ideation: zhIdeation,
        context: zhContext,
        changelog: zhChangelog,
        github: zhGithub,
        worktrees: zhWorktrees,
        onboarding: zhOnboarding,
        errors: zhErrors,
        kanban: zhKanban,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        defaultNS: 'common',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
