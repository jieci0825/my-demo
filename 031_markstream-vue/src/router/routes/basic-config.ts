import type { RouteRecordRaw } from 'vue-router'

import BasicConfigView from '../../views/BasicConfigView.vue'

export const basicConfigRoute: RouteRecordRaw = {
    path: '/basic-config',
    name: 'basic-config',
    component: BasicConfigView,
    meta: {
        title: '基础配置',
    },
}
