import type { RouteRecordRaw } from 'vue-router'

import SseStreamingView from '../../views/SseStreamingView.vue'

export const sseStreamingRoute: RouteRecordRaw = {
    path: '/sse-streaming',
    name: 'sse-streaming',
    component: SseStreamingView,
    meta: {
        title: 'sse 流式内容',
    },
}
