import { createRouter, createWebHistory } from 'vue-router'

import { basicConfigRoute } from './routes/basic-config'
import { codeBlockRoute } from './routes/code-block'
import { configImpactRoute } from './routes/config-impact'
import { customRenderNodeRoute } from './routes/custom-render-node'
import { katexRoute } from './routes/katex'
import { mermaidRoute } from './routes/mermaid'
import { quickStartRoute } from './routes/quick-start'
import { sseStreamingRoute } from './routes/sse-streaming'

export const menuRoutes = [
    quickStartRoute,
    basicConfigRoute,
    sseStreamingRoute,
    configImpactRoute,
    codeBlockRoute,
    mermaidRoute,
    katexRoute,
    customRenderNodeRoute,
]

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/quick-start',
        },
        quickStartRoute,
        basicConfigRoute,
        sseStreamingRoute,
        configImpactRoute,
        codeBlockRoute,
        mermaidRoute,
        katexRoute,
        customRenderNodeRoute,
        {
            path: '/:pathMatch(.*)*',
            redirect: '/quick-start',
        },
    ],
    scrollBehavior: () => ({ top: 0 }),
})

export default router
