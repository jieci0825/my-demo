import { createWebHistory, createRouter } from 'vue-router'

const routes = [
    {
        path: '/',
        meta: {
            title: '首页'
        },
        component: () => import('@/views/home/index.vue')
    },
    {
        path: '/editor/:mode',
        meta: {
            title: '问卷'
        },
        component: () => import('@/views/editor/index.vue')
    },
    {
        path: '/materials',
        meta: {
            title: '组件市场'
        },
        component: () => import('@/views/materials/index.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
