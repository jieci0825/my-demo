import Home from '@/views/home/index.vue'

export const routes = [
    {
        path: '/',
        meta: {
            title: '首页'
        },
        // 动态引入导致其他组件没有加载完成就被引用，所以这里不使用动态引入
        component: Home
    },
    {
        path: '/preview/:id',
        name: 'preview',
        meta: {
            title: '预览问卷'
        },
        component: () => import('@/views/preview/index.vue')
    },
    {
        path: '/editor',
        name: 'editor',
        meta: {
            title: '创建问卷'
        },
        component: () => import('@/views/editor/index.vue'),
        redirect: '/editor/survey-type',
        children: [
            {
                path: 'outline',
                name: 'editor-outline',
                component: () => import('@/views/editor/left-side/outline.vue')
            },
            {
                path: 'survey-type',
                name: 'editor-survey-type',
                component: () => import('@/views/editor/left-side/survey-type.vue')
            }
        ]
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
                component: () => import('@/views/materials/components/contact-group.vue'),
                redirect: '/materials/contact/phone',
                children: [
                    {
                        path: 'phone',
                        name: 'materials-contact-phone',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'email',
                        name: 'materials-contact-email',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'qq',
                        name: 'materials-contact-qq',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'wechat',
                        name: 'materials-contact-wechat',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'address',
                        name: 'materials-contact-address',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    }
                ]
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
                redirect: '/materials/personal-info/name',
                children: [
                    {
                        path: 'name',
                        name: 'materials-personal-info-name',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'id',
                        name: 'materials-personal-info-id',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'collage',
                        name: 'materials-personal-info-collage',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'major',
                        name: 'materials-personal-info-major',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'industry',
                        name: 'materials-personal-info-industry',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'company',
                        name: 'materials-personal-info-company',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'position',
                        name: 'materials-personal-info-position',
                        component: () => import('@/components/survey-comps/materials/input-comps/text-input.vue')
                    },
                    {
                        path: 'gender',
                        name: 'materials-personal-info-gender',
                        component: () => import('@/components/survey-comps/materials/select-comps/single-select.vue')
                    },
                    {
                        path: 'age',
                        name: 'materials-personal-info-age',
                        component: () => import('@/components/survey-comps/materials/select-comps/single-select.vue')
                    },
                    {
                        path: 'education',
                        name: 'materials-personal-info-education',
                        component: () => import('@/components/survey-comps/materials/select-comps/single-select.vue')
                    },
                    {
                        path: 'career',
                        name: 'materials-personal-info-career',
                        component: () => import('@/components/survey-comps/materials/select-comps/single-select.vue')
                    },
                    {
                        path: 'birth',
                        name: 'materials-personal-info-birth',
                        component: () => import('@/components/survey-comps/materials/advanced-comps/date-time.vue')
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
