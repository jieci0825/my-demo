import { defineStore } from 'pinia'
import { defaultStatusMap } from '@/configs/default-status/default-status-mpa'
import {
    DATE_TIME_KEY,
    MULTIPLE_PIC_SELECT_KEY,
    MULTIPLE_SELECT_KEY,
    OPTION_SELECT_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    RATE_SCORE_KEY,
    SINGLE_PIC_SELECT_KEY,
    SINGLE_SELECT_KEY,
    TEXT_INPUT_KEY,
    TEXT_NODE_KEY
} from '@/constants'
import {
    setTextState,
    addOption,
    removeOption,
    updateCurrentState,
    setPicLinkByIndex,
    toggleType
} from './common-actions'
import { isEmpty } from 'element-plus/es/utils/types.mjs'
import type { MaterialKeys } from '@/types/materials'
import type { BaseBusinessComp } from '@/types'

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
                [OPTION_SELECT_KEY]: defaultStatusMap[OPTION_SELECT_KEY],
                [SINGLE_SELECT_KEY]: defaultStatusMap[SINGLE_SELECT_KEY],
                [MULTIPLE_SELECT_KEY]: defaultStatusMap[MULTIPLE_SELECT_KEY],
                [SINGLE_PIC_SELECT_KEY]: defaultStatusMap[SINGLE_PIC_SELECT_KEY],
                [MULTIPLE_PIC_SELECT_KEY]: defaultStatusMap[MULTIPLE_PIC_SELECT_KEY],
                [TEXT_NODE_KEY]: defaultStatusMap[TEXT_NODE_KEY],
                [PRESET_PERSONAL_INFO_GENDER_KEY]: defaultStatusMap[PRESET_PERSONAL_INFO_GENDER_KEY],
                [TEXT_INPUT_KEY]: defaultStatusMap[TEXT_INPUT_KEY],
                [RATE_SCORE_KEY]: defaultStatusMap[RATE_SCORE_KEY],
                [DATE_TIME_KEY]: defaultStatusMap[DATE_TIME_KEY]
            }
        } as IUseMaterialStore
    },
    actions: {
        setTextState,
        addOption,
        removeOption,
        updateCurrentState,
        setPicLinkByIndex,
        toggleType,
        changeCurrentMaterialComp(curMaterialComp: MaterialKeys) {
            if (isEmpty(curMaterialComp)) return
            this.currentMaterialComp = curMaterialComp
        }
    }
})

export type MaterialStoreInstance = ReturnType<typeof useMaterialStore>
