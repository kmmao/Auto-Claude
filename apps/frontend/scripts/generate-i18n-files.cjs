#!/usr/bin/env node

/**
 * 批量生成 i18n 翻译文件骨架
 * 用于快速创建所有必需的翻译资源文件
 */

const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../src/i18n/locales');

// 定义需要创建的翻译文件及其基础结构
const translationFiles = {
    settings: {
        en: {
            title: 'Settings',
            tabs: {
                general: 'General',
                integrations: 'Integrations',
                projects: 'Projects',
                advanced: 'Advanced'
            }
        },
        'zh-CN': {
            title: '设置',
            tabs: {
                general: '常规',
                integrations: '集成',
                projects: '项目',
                advanced: '高级'
            }
        }
    },
    tasks: {
        en: {
            title: 'Tasks',
            status: {
                pending: 'Pending',
                inProgress: 'In Progress',
                completed: 'Completed',
                failed: 'Failed'
            },
            actions: {
                create: 'Create Task',
                edit: 'Edit Task',
                delete: 'Delete Task',
                start: 'Start',
                pause: 'Pause',
                resume: 'Resume',
                cancel: 'Cancel'
            }
        },
        'zh-CN': {
            title: '任务',
            status: {
                pending: '待处理',
                inProgress: '进行中',
                completed: '已完成',
                failed: '失败'
            },
            actions: {
                create: '创建任务',
                edit: '编辑任务',
                delete: '删除任务',
                start: '开始',
                pause: '暂停',
                resume: '继续',
                cancel: '取消'
            }
        }
    },
    terminal: {
        en: {
            title: 'Terminal',
            actions: {
                newTerminal: 'New Terminal',
                closeTerminal: 'Close Terminal',
                clearTerminal: 'Clear Terminal'
            }
        },
        'zh-CN': {
            title: '终端',
            actions: {
                newTerminal: '新建终端',
                closeTerminal: '关闭终端',
                clearTerminal: '清空终端'
            }
        }
    },
    roadmap: {
        en: { title: 'Roadmap' },
        'zh-CN': { title: '路线图' }
    },
    insights: {
        en: { title: 'Insights' },
        'zh-CN': { title: '洞察' }
    },
    ideation: {
        en: { title: 'Ideation' },
        'zh-CN': { title: '创意' }
    },
    context: {
        en: { title: 'Context' },
        'zh-CN': { title: '上下文' }
    },
    changelog: {
        en: { title: 'Changelog' },
        'zh-CN': { title: '更新日志' }
    },
    github: {
        en: { title: 'GitHub Issues' },
        'zh-CN': { title: 'GitHub 问题' }
    },
    worktrees: {
        en: { title: 'Worktrees' },
        'zh-CN': { title: '工作树' }
    },
    onboarding: {
        en: { title: 'Welcome to Auto Claude' },
        'zh-CN': { title: '欢迎使用 Auto Claude' }
    },
    errors: {
        en: {
            generic: 'An error occurred',
            networkError: 'Network error',
            notFound: 'Not found'
        },
        'zh-CN': {
            generic: '发生错误',
            networkError: '网络错误',
            notFound: '未找到'
        }
    }
};

// 创建翻译文件
Object.entries(translationFiles).forEach(([filename, translations]) => {
    Object.entries(translations).forEach(([locale, content]) => {
        const filePath = path.join(localesDir, locale, `${filename}.json`);
        const dir = path.dirname(filePath);

        // 确保目录存在
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // 写入文件（如果不存在）
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
            console.log(`✓ Created: ${filePath}`);
        } else {
            console.log(`⊘ Skipped (exists): ${filePath}`);
        }
    });
});

console.log('\n✨ Translation file generation complete!');
