import { JC_WEN_JUAN_ACTIVE_VIEW, SINGLE_PIC_SELECT_KEY, SINGLE_SELECT_KEY } from '@/constants'
import { useMaterialStore } from '@/stores/use-material'
import type { MaterialKeys } from '@/types/materials'
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
                component: () => import('@/views/materials/components/input-group.vue')
            },
            {
                path: 'advanced',
                name: 'materials-advanced',
                component: () => import('@/views/materials/components/advanced-group.vue')
            },
            {
                path: 'contact',
                name: 'materials-contact',
                component: () => import('@/views/materials/components/contact-group.vue')
            },
            {
                path: 'note',
                name: 'materials-note',
                component: () => import('@/views/materials/components/note-group.vue')
            },
            {
                path: 'personal-info',
                name: 'materials-personal-info',
                component: () => import('@/views/materials/components/personal-info-group.vue')
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

const router = createRouter({
    history: createWebHistory(),
    routes
})

const routeNameToMaterialCompKeyMap: { [key: string]: MaterialKeys } = {
    'materials-select-single': SINGLE_SELECT_KEY,
    'materials-select-single-pic': SINGLE_PIC_SELECT_KEY
}

router.beforeEach((to, _, next) => {
    // 只有组件市场视图视图才会触发
    const curAvtiveView = localStorage.getItem(JC_WEN_JUAN_ACTIVE_VIEW)

    if (curAvtiveView && curAvtiveView === 'materials') {
        const materialStore = useMaterialStore()
        if (to.name) {
            const key = routeNameToMaterialCompKeyMap[to.name as string]
            materialStore.changeCurrentMaterialComp(key)
        }
    }

    next()
})

export default router
