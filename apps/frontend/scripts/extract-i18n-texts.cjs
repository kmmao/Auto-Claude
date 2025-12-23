#!/usr/bin/env node

/**
 * Auto Claude i18n 文本提取工具
 * 
 * 用法：
 *   node scripts/extract-i18n-texts.cjs src/renderer/components/Sidebar.tsx
 * 
 * 功能：
 * 1. 扫描组件中的硬编码文本
 * 2. 生成翻译键建议
 * 3. 输出需要添加到翻译文件的内容
 */

const fs = require('fs');
const path = require('path');

// 简单的文本提取正则（可以根据需要扩展）
const TEXT_PATTERNS = [
    // JSX 文本内容: <div>Text</div>
    /\>([A-Z][a-zA-Z\s&]+)\</g,
    // 字符串字面量: "Text" 或 'Text'
    /["']([A-Z][a-zA-Z\s&:,.-]+)["']/g,
    // placeholder 属性
    /placeholder=["']([^"']+)["']/g,
    // title 属性
    /title=["']([^"']+)["']/g,
];

function extractTexts(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const componentName = path.basename(filePath, path.extname(filePath));

    console.log(`\n📝 Extracting texts from: ${componentName}\n`);
    console.log('='.repeat(60));

    const extractedTexts = new Set();

    TEXT_PATTERNS.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const text = match[1].trim();

            // 过滤掉一些明显不是UI文本的内容
            if (
                text.length > 2 &&
                text.length < 100 &&
                !text.match(/^[a-z]/) && // 不以小写字母开头（可能是变量）
                !text.match(/^\d/) && // 不以数字开头
                !text.includes('className') &&
                !text.includes('useState') &&
                !text.includes('useEffect')
            ) {
                extractedTexts.add(text);
            }
        }
    });

    if (extractedTexts.size === 0) {
        console.log('ℹ️  No texts found (or all texts are already using i18n)');
        return;
    }

    console.log(`\n✅ Found ${extractedTexts.size} potential texts to translate:\n`);

    const suggestions = {};
    const namespace = componentName.toLowerCase();

    Array.from(extractedTexts).sort().forEach((text, index) => {
        // 生成翻译键建议（camelCase）
        const key = text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '')
            .split(/\s+/)
            .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
            .join('');

        suggestions[key] = text;
        console.log(`${index + 1}. "${text}"`);
        console.log(`   Key suggestion: ${namespace}:${key}\n`);
    });

    // 生成 JSON 输出
    console.log('='.repeat(60));
    console.log('\n📋 Add to translation files:\n');
    console.log(`// en/${namespace}.json`);
    console.log(JSON.stringify(suggestions, null, 2));

    console.log(`\n// zh-CN/${namespace}.json`);
    console.log('// TODO: Translate the values to Chinese');
    console.log(JSON.stringify(suggestions, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('\n💡 Next steps:');
    console.log(`1. Add the above JSON to src/i18n/locales/en/${namespace}.json`);
    console.log(`2. Translate and add to src/i18n/locales/zh-CN/${namespace}.json`);
    console.log(`3. Update the component to use: const { t } = useTranslation('${namespace}');`);
    console.log(`4. Replace hardcoded texts with: {t('${namespace}:keyName')}\n`);
}

// 主程序
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log('Usage: node scripts/extract-i18n-texts.cjs <component-file>');
    console.log('Example: node scripts/extract-i18n-texts.cjs src/renderer/components/Sidebar.tsx');
    process.exit(1);
}

extractTexts(args[0]);
