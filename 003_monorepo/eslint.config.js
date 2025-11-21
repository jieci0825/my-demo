import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginVue from 'eslint-plugin-vue'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import globals from 'globals'
import eslintConfigPrettier from 'eslint-config-prettier'

const ignores = ['**/dist/**', '**/node_modules/**', '.*', 'scripts/**', '**/*.d.ts']

export default [
    // 通用配置
    {
        ignores,
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            prettier: eslintPluginPrettier,
        },
        languageOptions: {
            ecmaVersion: 'latest', // 支持最新的 ECMAScript 版本
            sourceType: 'module', // 支持模块化
        },
        rules: {
            'no-var': 'error', // 禁止使用 var
        },
    },
    // 前端 Vue 配置
    ...eslintPluginVue.configs['flat/recommended'],
    {
        files: [
            'apps/mobile/**/*.{js,ts,jsx,tsx,vue}',
            'apps/web/**/*.{js,ts,jsx,tsx,vue}',
            'packages/**/*.{js,ts,jsx,tsx,vue}',
        ],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    // 后端配置
    {
        files: ['apps/server/**/*.{js,ts}'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    // Prettier 配置放在最后，覆盖冲突的规则
    eslintConfigPrettier,
]
