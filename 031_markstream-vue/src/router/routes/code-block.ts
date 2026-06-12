import type { RouteRecordRaw } from 'vue-router'

import CodeBlockView from '../../views/CodeBlockView.vue'

export const codeBlockRoute: RouteRecordRaw = {
    path: '/code-block',
    name: 'code-block',
    component: CodeBlockView,
    meta: {
        title: '可选-代码块',
    },
}
