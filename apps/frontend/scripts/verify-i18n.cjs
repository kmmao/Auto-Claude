#!/usr/bin/env node

/**
 * i18n 功能验证脚本
 * 
 * 此脚本验证 i18n 配置是否正确,包括:
 * 1. 翻译文件是否存在
 * 2. 翻译文件是否为有效的 JSON
 * 3. 英文和中文翻译键是否匹配
 * 4. 是否有缺失的翻译
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');
const SUPPORTED_LOCALES = ['en', 'zh-CN'];
const NAMESPACES = [
    'common',
    'sidebar',
    'settings',
    'tasks',
    'terminal',
    'roadmap',
    'insights',
    'ideation',
    'context',
    'changelog',
    'github',
    'worktrees',
    'onboarding',
    'errors'
];

let hasErrors = false;

console.log('🔍 开始验证 i18n 配置...\n');

// 1. 检查翻译文件是否存在
console.log('📁 检查翻译文件...');
for (const locale of SUPPORTED_LOCALES) {
    const localeDir = path.join(LOCALES_DIR, locale);

    if (!fs.existsSync(localeDir)) {
        console.error(`❌ 缺少语言目录: ${locale}`);
        hasErrors = true;
        continue;
    }

    for (const namespace of NAMESPACES) {
        const filePath = path.join(localeDir, `${namespace}.json`);

        if (!fs.existsSync(filePath)) {
            console.error(`❌ 缺少翻译文件: ${locale}/${namespace}.json`);
            hasErrors = true;
        }
    }
}

if (!hasErrors) {
    console.log('✅ 所有翻译文件都存在\n');
}

// 2. 检查 JSON 格式是否有效
console.log('📝 检查 JSON 格式...');
const translations = {};

for (const locale of SUPPORTED_LOCALES) {
    translations[locale] = {};

    for (const namespace of NAMESPACES) {
        const filePath = path.join(LOCALES_DIR, locale, `${namespace}.json`);

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            translations[locale][namespace] = JSON.parse(content);
        } catch (error) {
            console.error(`❌ JSON 解析错误: ${locale}/${namespace}.json`);
            console.error(`   ${error.message}`);
            hasErrors = true;
        }
    }
}

if (!hasErrors) {
    console.log('✅ 所有 JSON 文件格式正确\n');
}

// 3. 检查翻译键是否匹配
console.log('🔑 检查翻译键匹配...');

function getAllKeys(obj, prefix = '') {
    let keys = [];

    for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            keys = keys.concat(getAllKeys(value, fullKey));
        } else {
            keys.push(fullKey);
        }
    }

    return keys;
}

for (const namespace of NAMESPACES) {
    const enKeys = getAllKeys(translations['en'][namespace] || {});
    const zhKeys = getAllKeys(translations['zh-CN'][namespace] || {});

    const enSet = new Set(enKeys);
    const zhSet = new Set(zhKeys);

    // 检查英文中有但中文中没有的键
    const missingInZh = enKeys.filter(key => !zhSet.has(key));
    if (missingInZh.length > 0) {
        console.warn(`⚠️  ${namespace}: 中文缺少 ${missingInZh.length} 个翻译键`);
        if (missingInZh.length <= 5) {
            missingInZh.forEach(key => console.warn(`   - ${key}`));
        }
    }

    // 检查中文中有但英文中没有的键
    const missingInEn = zhKeys.filter(key => !enSet.has(key));
    if (missingInEn.length > 0) {
        console.warn(`⚠️  ${namespace}: 英文缺少 ${missingInEn.length} 个翻译键`);
        if (missingInEn.length <= 5) {
            missingInEn.forEach(key => console.warn(`   - ${key}`));
        }
    }
}

console.log('✅ 翻译键检查完成\n');

// 4. 统计翻译内容
console.log('📊 翻译统计:\n');

let totalKeys = 0;
let translatedKeys = 0;

for (const namespace of NAMESPACES) {
    const enKeys = getAllKeys(translations['en'][namespace] || {});
    const zhKeys = getAllKeys(translations['zh-CN'][namespace] || {});

    const enCount = enKeys.length;
    const zhCount = zhKeys.length;

    totalKeys += enCount;

    // 检查中文翻译是否为空或与英文相同
    let actuallyTranslated = 0;
    for (const key of zhKeys) {
        const keyPath = key.split('.');
        let enValue = translations['en'][namespace];
        let zhValue = translations['zh-CN'][namespace];

        for (const part of keyPath) {
            enValue = enValue?.[part];
            zhValue = zhValue?.[part];
        }

        if (zhValue && zhValue !== enValue && zhValue !== '') {
            actuallyTranslated++;
        }
    }

    translatedKeys += actuallyTranslated;

    const percentage = enCount > 0 ? ((actuallyTranslated / enCount) * 100).toFixed(1) : '0.0';
    const status = percentage === '100.0' ? '✅' : percentage === '0.0' ? '🔴' : '🟡';

    console.log(`${status} ${namespace.padEnd(15)} ${actuallyTranslated.toString().padStart(3)}/${enCount.toString().padEnd(3)} (${percentage}%)`);
}

console.log('\n' + '='.repeat(50));
const overallPercentage = totalKeys > 0 ? ((translatedKeys / totalKeys) * 100).toFixed(1) : '0.0';
console.log(`📈 总体进度: ${translatedKeys}/${totalKeys} (${overallPercentage}%)`);
console.log('='.repeat(50) + '\n');

// 5. 检查 i18n 配置文件
console.log('⚙️  检查 i18n 配置...');
const i18nConfigPath = path.join(__dirname, '../src/i18n/index.ts');

if (!fs.existsSync(i18nConfigPath)) {
    console.error('❌ 找不到 i18n 配置文件: src/i18n/index.ts');
    hasErrors = true;
} else {
    const configContent = fs.readFileSync(i18nConfigPath, 'utf-8');

    // 检查是否导入了所有命名空间
    for (const namespace of NAMESPACES) {
        const enImport = `import en${namespace.charAt(0).toUpperCase() + namespace.slice(1)}`;
        const zhImport = `import zh${namespace.charAt(0).toUpperCase() + namespace.slice(1)}`;

        if (!configContent.includes(enImport)) {
            console.warn(`⚠️  配置文件中缺少英文导入: ${namespace}`);
        }

        if (!configContent.includes(zhImport)) {
            console.warn(`⚠️  配置文件中缺少中文导入: ${namespace}`);
        }
    }

    // 检查是否配置了语言检测器
    if (!configContent.includes('LanguageDetector')) {
        console.error('❌ 配置文件中缺少 LanguageDetector');
        hasErrors = true;
    }

    // 检查是否配置了 localStorage 缓存
    if (!configContent.includes('localStorage')) {
        console.warn('⚠️  配置文件中未启用 localStorage 缓存');
    }

    console.log('✅ i18n 配置文件检查完成\n');
}

// 6. 最终结果
console.log('='.repeat(50));
if (hasErrors) {
    console.log('❌ 验证失败!请修复上述错误。');
    process.exit(1);
} else {
    console.log('✅ 验证通过!i18n 配置正确。');
    console.log('\n💡 提示:');
    console.log('   - 当前翻译进度: ' + overallPercentage + '%');
    console.log('   - 运行 "npm run dev" 启动应用测试语言切换');
    console.log('   - 使用 "node scripts/extract-i18n-texts.cjs" 提取组件文本');
    process.exit(0);
}
