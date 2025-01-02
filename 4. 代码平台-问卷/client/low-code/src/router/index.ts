import {
    DATE_TIME_KEY,
    JC_WEN_JUAN_ACTIVE_VIEW,
    MULTIPLE_PIC_SELECT_KEY,
    MULTIPLE_SELECT_KEY,
    OPTION_SELECT_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    PRESET_PERSONAL_INFO_NAME_KEY,
    RATE_SCORE_KEY,
    SINGLE_PIC_SELECT_KEY,
    SINGLE_SELECT_KEY,
    TEXT_INPUT_KEY,
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
    'materials-select-option': OPTION_SELECT_KEY,
    'materials-select-single-pic': SINGLE_PIC_SELECT_KEY,
    'materials-select-multiple-pic': MULTIPLE_PIC_SELECT_KEY,
    'materials-node-text': TEXT_NODE_KEY,
    'materials-input-text': TEXT_INPUT_KEY,
    'materials-advanced-rate-score': RATE_SCORE_KEY,
    'materials-advanced-date-time': DATE_TIME_KEY,
    'materials-personal-info-gender': PRESET_PERSONAL_INFO_GENDER_KEY,
    'materials-personal-info-name': PRESET_PERSONAL_INFO_NAME_KEY
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
