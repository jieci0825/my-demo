import type { RouteRecordRaw } from 'vue-router'

import ConfigImpactView from '../../views/ConfigImpactView.vue'

export const configImpactRoute: RouteRecordRaw = {
    path: '/config-impact',
    name: 'config-impact',
    component: ConfigImpactView,
    meta: {
        title: '配置影响',
    },
}
