/**
 * @type {import('cz-git').UserConfig}
 */
export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // @see: https://commitlint.js.org/#/reference-rules
        'body-leading-blank': [2, 'always'], // 提交信息的正文（body）前必须有一个空行
        'footer-leading-blank': [1, 'always'], // 提交信息的页脚（footer）前必须有一个空行
        'header-max-length': [2, 'always', 108], // 提交信息的头部（header）最大长度
        'subject-empty': [2, 'never'], // 提交信息的主题（subject）不能为空
        'subject-case': [0], // 提交信息主题的格式
        'type-empty': [
            2,
            'never',
            ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'chore', 'ci', 'test', 'revert'],
        ], // 提交信息类型不能为空
    },
    prompt: {
        types: [
            { value: 'feat', name: '新功能: 新增功能' },
            { value: 'fix', name: '修复: 修复 bug' },
            { value: 'docs', name: '文档: 更新文档' },
            { value: 'style', name: '格式: 代码格式（不影响代码运行的变动）' },
            { value: 'refactor', name: '重构: 代码重构（不包括 bug 修复，也不包括功能新增）' },
            { value: 'perf', name: '性能: 改进性能的代码更改' },
            { value: 'test', name: '测试: 添加或修改测试' },
            { value: 'chore', name: '构建: 改变构建流程、依赖、工具等（不包括修复 bug 或功能新增）' },
        ],
        scopes: ['root', 'server', 'mobile', 'web', 'components', 'utils'],
        allowCustomScopes: true, // 允许自定义范围
        skipQuestions: ['body', 'footerPrefix', 'footer', 'breaking'], // 跳过"详细描述"和“底部信息”
        messages: {
            type: '请选择提交类型:',
            scope: '请选择一个提交范围 (可选):',
            subject: '请简要描述提交:',
            body: '请输入详细描述 (可选):',
            footer: '请输入要关闭的issue (可选):',
            confirmCommit: '确认提交?',
        },
    },
}
