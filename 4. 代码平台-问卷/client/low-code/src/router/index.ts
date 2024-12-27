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
        redirect: '/materials/select',
        component: () => import('@/views/materials/index.vue'),
        children: [
            {
                path: 'input',
                component: () => import('@/views/materials/components/input-group.vue')
            },
            {
                path: 'advanced',
                component: () => import('@/views/materials/components/advanced-group.vue')
            },
            {
                path: 'contact',
                component: () => import('@/views/materials/components/contact-group.vue')
            },
            {
                path: 'note',
                component: () => import('@/views/materials/components/note-group.vue')
            },
            {
                path: 'personal-info',
                component: () => import('@/views/materials/components/personal-info-group.vue')
            },
            {
                path: 'select',
                component: () => import('@/views/materials/components/select-group.vue'),
                children: []
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
