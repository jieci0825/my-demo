import { defineStore } from 'pinia'
import { defaultStatusMpa } from '@/configs/default-status/default-status-mpa'
import { SINGLE_SELECT_KEY } from '@/constants'

export const useMaterialStore = defineStore('materialStore', {
    state: () => ({
        currentMaterialComp: SINGLE_SELECT_KEY,
        // 记录所有的业务组件
        comps: {
            SINGLE_SELECT_KEY: defaultStatusMpa[SINGLE_SELECT_KEY]()
        }
    })
})
