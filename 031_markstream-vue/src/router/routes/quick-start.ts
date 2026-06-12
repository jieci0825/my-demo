import type { RouteRecordRaw } from 'vue-router'

import QuickStartView from '../../views/QuickStartView.vue'

export const quickStartRoute: RouteRecordRaw = {
    path: '/quick-start',
    name: 'quick-start',
    component: QuickStartView,
    meta: {
        title: '快速开始',
    },
}
