import { defaultStatusMpa } from '@/configs/default-status/default-status-mpa'
import { defineStore } from 'pinia'

export const useMaterialStore = defineStore('materialStore', {
    state: () => ({
        currentMaterialComp: 'single-select',
        // 记录所有的业务组件
        comps: {
            'single-select': defaultStatusMpa['single-select']()
        }
    })
})
