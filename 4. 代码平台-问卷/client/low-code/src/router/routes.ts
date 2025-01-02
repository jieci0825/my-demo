export const routes = [
    {
        path: '/',
        meta: {
            title: '首页'
        },
        component: () => import('@/views/home/index.vue')
    },
    {
        path: '/editor/:mode',
        name: 'editor',
        meta: {
            title: '问卷'
        },
        component: () => import('@/views/editor/index.vue')
    },
    {
        path: '/materials',
        name: 'materials',
        meta: {
            title: '组件市场'
        },
        redirect: '/materials/select',
        component: () => import('@/views/materials/index.vue'),
        children: [
            {
                path: 'input',
                name: 'materials-input',
                component: () => import('@/views/materials/components/input-group.vue'),
                redirect: '/materials/input/text',
                children: [
                    {
                        path: 'text',
                        name: 'materials-input-text',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    }
                ]
            },
            {
                path: 'advanced',
                name: 'materials-advanced',
                component: () => import('@/views/materials/components/advanced-group.vue'),
                redirect: '/materials/advanced/rate-score',
                children: [
                    {
                        path: 'rate-score',
                        name: 'materials-advanced-rate-score',
                        component: () => import('@/components/survey-comps/materials/advanced-comps/rate-score.vue')
                    },
                    {
                        path: 'date-time',
                        name: 'materials-advanced-date-time',
                        component: () => import('@/components/survey-comps/materials/advanced-comps/date-time.vue')
                    }
                ]
            },
            {
                path: 'contact',
                name: 'materials-contact',
                component: () => import('@/views/materials/components/contact-group.vue')
            },
            {
                path: 'note',
                name: 'materials-note',
                component: () => import('@/views/materials/components/note-group.vue'),
                redirect: '/materials/note/text',
                children: [
                    {
                        path: 'text',
                        name: 'materials-node-text',
                        component: () => import('@/components/survey-comps/materials/node-comps/text-node.vue')
                    }
                ]
            },
            {
                path: 'personal-info',
                name: 'materials-personal-info',
                component: () => import('@/views/materials/components/personal-info-group.vue'),
                children: [
                    {
                        path: 'gender',
                        name: 'materials-personal-info-gender',
                        component: () => import('@/components/survey-comps/materials/select-comps/single-select.vue')
                    }
                ]
            },
            {
                path: 'select',
                name: 'materials-select',
                component: () => import('@/views/materials/components/select-group.vue'),
                redirect: '/materials/select/single',
                children: [
                    {
                        path: 'single',
                        name: 'materials-select-single',
                        component: () => import('@/components/survey-comps/materials/select-comps/single-select.vue')
                    },
                    {
                        path: 'multiple',
                        name: 'materials-select-multiple',
                        component: () => import('@/components/survey-comps/materials/select-comps/multiple-select.vue')
                    },
                    {
                        path: 'option',
                        name: 'materials-select-option',
                        component: () => import('@/components/survey-comps/materials/select-comps/option-select.vue')
                    },
                    {
                        path: 'single-pic',
                        name: 'materials-select-single-pic',
                        component: () =>
                            import('@/components/survey-comps/materials/select-comps/single-pic-select.vue')
                    },
                    {
                        path: 'multiple-pic',
                        name: 'materials-select-multiple-pic',
                        component: () =>
                            import('@/components/survey-comps/materials/select-comps/multiple-pic-select.vue')
                    }
                ]
            }
        ]
    }
]
