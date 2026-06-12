import type { RouteRecordRaw } from 'vue-router'

import KatexView from '../../views/KatexView.vue'

export const katexRoute: RouteRecordRaw = {
    path: '/katex',
    name: 'katex',
    component: KatexView,
    meta: {
        title: '可选-KaTeX',
    },
}
