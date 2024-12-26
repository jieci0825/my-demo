import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/views/home/index.vue')
    },
    {
        path: '/editor',
        component: () => import('@/views/editor/index.vue')
    },
    {
        path: '/materials',
        component: () => import('@/views/materials/index.vue')
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes
})

export default router
