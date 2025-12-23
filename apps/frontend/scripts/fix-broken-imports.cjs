#!/usr/bin/env node

/**
 * 批量修复被破坏的 import 语句 - 增强版
 * 
 * 修复所有可能的错误模式
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/renderer/components');

let fixedCount = 0;
let errorCount = 0;

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const original = content;
        let changed = false;

        // 先移除所有错误插入的 useTranslation import
        // 然后在文件开头正确添加

        // 模式 1: 在单词中间插入 (如 Treimport...ndingUp)
        content = content.replace(
            /([A-Z][a-z]+)import\s*{\s*useTranslation\s*}\s*from\s*['"]react-i18next['"];\s*\n\s*([a-z]+[A-Z][a-zA-Z]*)/g,
            "$1$2"
        );

        // 模式 2: } fimport...rom
        content = content.replace(
            /}\s*fimport\s*{\s*useTranslation\s*}\s*from\s*['"]react-i18next['"];\s*\n\s*rom\s*['"]([^'"]+)['"]/g,
            "} from '$1'"
        );

        // 模式 3: iimport...mport
        content = content.replace(
            /iimport\s*{\s*useTranslation\s*}\s*from\s*['"]react-i18next['"];\s*\n\s*mport/g,
            "import"
        );

        // 模式 4: import { xxx }import...from
        content = content.replace(
            /import\s*({[^}]+})\s*import\s*{\s*useTranslation\s*}\s*from\s*['"]react-i18next['"];\s*\n\s*from/g,
            "import $1 from"
        );

        // 模式 5: from '.import....'
        content = content.replace(
            /from\s*['"]([^'"]*)import\s*{\s*useTranslation\s*}\s*from\s*['"]react-i18next['"];\s*\n\s*([^'"]+)['"]/g,
            "from '$1$2'"
        );

        // 模式 6: 在逗号后插入
        content = content.replace(
            /,\s*import\s*{\s*useTranslation\s*}\s*from\s*['"]react-i18next['"];\s*\n/g,
            ",\n  "
        );

        // 移除重复的 useTranslation import
        const useTranslationImports = content.match(/import\s*{\s*useTranslation\s*}\s*from\s*['"]react-i18next['"];?\s*\n/g);
        if (useTranslationImports && useTranslationImports.length > 1) {
            // 移除所有的 useTranslation import
            content = content.replace(/import\s*{\s*useTranslation\s*}\s*from\s*['"]react-i18next['"];?\s*\n/g, '');
            changed = true;
        }

        // 检查是否需要 useTranslation
        const needsTranslation = content.includes('useTranslation(') || content.includes('const { t }');

        // 在第一个 import 后添加 useTranslation import (如果需要且不存在)
        if (needsTranslation && !content.includes("from 'react-i18next'")) {
            const firstImportMatch = content.match(/^(import\s+[^;]+;\n)/m);
            if (firstImportMatch) {
                content = content.replace(
                    firstImportMatch[0],
                    firstImportMatch[0] + "import { useTranslation } from 'react-i18next';\n"
                );
                changed = true;
            }
        }

        if (content !== original || changed) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`✅ 修复: ${path.relative(COMPONENTS_DIR, filePath)}`);
            fixedCount++;
            return true;
        }

        return false;
    } catch (error) {
        console.error(`❌ 错误: ${path.relative(COMPONENTS_DIR, filePath)} - ${error.message}`);
        errorCount++;
        return false;
    }
}

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!file.startsWith('.') && file !== 'node_modules') {
                scanDirectory(fullPath);
            }
        } else if (file.endsWith('.tsx') && !file.endsWith('.test.tsx')) {
            fixFile(fullPath);
        }
    });
}

console.log('🔧 开始批量修复 import 语句错误 (增强版)...\n');
console.log('='.repeat(60));

scanDirectory(COMPONENTS_DIR);

console.log('='.repeat(60));
console.log(`\n✅ 修复完成!`);
console.log(`   修复文件数: ${fixedCount}`);
console.log(`   错误数: ${errorCount}`);
console.log(`\n💡 现在运行 npm run dev 测试应用\n`);
