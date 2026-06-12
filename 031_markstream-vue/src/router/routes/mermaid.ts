import type { RouteRecordRaw } from 'vue-router'

import MermaidView from '../../views/MermaidView.vue'

export const mermaidRoute: RouteRecordRaw = {
    path: '/mermaid',
    name: 'mermaid',
    component: MermaidView,
    meta: {
        title: '可选-Mermaid',
    },
}
