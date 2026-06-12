import type { RouteRecordRaw } from 'vue-router'

import CustomRenderNodeView from '../../views/CustomRenderNodeView.vue'

export const customRenderNodeRoute: RouteRecordRaw = {
    path: '/custom-render-node',
    name: 'custom-render-node',
    component: CustomRenderNodeView,
    meta: {
        title: '自定义渲染节点',
    },
}
