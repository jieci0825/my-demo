import { defineStore } from 'pinia'
import { defaultStatusMap } from '@/configs/default-status/default-status-mpa'
import { SINGLE_PIC_SELECT_KEY, SINGLE_SELECT_KEY } from '@/constants'
import { setTextState, addOption, removeOption, updateCurrentState } from './common-actions'
import type { MaterialKeys } from '@/types/materials'
import type { BaseBusinessComp } from '@/types'
import { isEmpty } from 'element-plus/es/utils/types.mjs'

interface IUseMaterialStore {
    currentMaterialComp: MaterialKeys
    comps: {
        [key in MaterialKeys]: BaseBusinessComp
    }
}

export const useMaterialStore = defineStore('materialStore', {
    state: () => {
        return {
            currentMaterialComp: SINGLE_SELECT_KEY,
            // 记录所有的业务组件
            comps: {
                [SINGLE_SELECT_KEY]: defaultStatusMap[SINGLE_SELECT_KEY],
                [SINGLE_PIC_SELECT_KEY]: defaultStatusMap[SINGLE_PIC_SELECT_KEY]
            }
        } as IUseMaterialStore
    },
    actions: {
        setTextState,
        addOption,
        removeOption,
        updateCurrentState,
        changeCurrentMaterialComp(curMaterialComp: MaterialKeys) {
            if (isEmpty(curMaterialComp)) return
            this.currentMaterialComp = curMaterialComp
        }
    }
})

export type MaterialStoreInstance = ReturnType<typeof useMaterialStore>
