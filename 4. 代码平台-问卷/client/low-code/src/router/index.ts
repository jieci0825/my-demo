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
                redirect: '/materials/select/single',
                children: [
                    {
                        path: 'single',
                        component: () => import('@/components/survey-comps/materials/select-comps/single-select.vue')
                    },
                    {
                        path: 'multiple',
                        component: () => import('@/components/survey-comps/materials/select-comps/multiple-select.vue')
                    },
                    {
                        path: 'option',
                        component: () => import('@/components/survey-comps/materials/select-comps/option-select.vue')
                    },
                    {
                        path: 'single-pic',
                        component: () =>
                            import('@/components/survey-comps/materials/select-comps/single-pic-select.vue')
                    },
                    {
                        path: 'multiple-pic',
                        component: () =>
                            import('@/components/survey-comps/materials/select-comps/multiple-pic-select.vue')
                    }
                ]
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
