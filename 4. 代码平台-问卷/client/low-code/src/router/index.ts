import {
    JC_WEN_JUAN_ACTIVE_VIEW,
    MULTIPLE_SELECT_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    SINGLE_PIC_SELECT_KEY,
    SINGLE_SELECT_KEY,
    TEXT_NODE_KEY
} from '@/constants'
import { useMaterialStore } from '@/stores/use-material'
import { createWebHistory, createRouter } from 'vue-router'
import { routes } from './routes'
import type { MaterialKeys } from '@/types/materials'

const router = createRouter({
    history: createWebHistory(),
    routes
})

const routeNameToMaterialCompKeyMap: { [key: string]: MaterialKeys } = {
    'materials-select-single': SINGLE_SELECT_KEY,
    'materials-select-multiple': MULTIPLE_SELECT_KEY,
    'materials-select-single-pic': SINGLE_PIC_SELECT_KEY,
    'materials-node-text': TEXT_NODE_KEY,
    'materials-personal-info-gender': PRESET_PERSONAL_INFO_GENDER_KEY
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
