import singleSelectDefaultStatus from './single-select'
import multipleSelectDefaultStatus from './multiple-select'
import singlePicSelectDefaultStatus from './single-pic-select'
import textNodeDefaultStatus from './text-node'
import {
    SINGLE_PIC_SELECT_KEY,
    SINGLE_SELECT_KEY,
    TEXT_NODE_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    MULTIPLE_SELECT_KEY,
    MULTIPLE_PIC_SELECT_KEY
} from '@/constants'
import { updateInitStatusBeforeAdd } from '@/utils'
import type { MaterialKeys } from '@/types/materials'

// 需要初始化的业务组件key
const keyToInit: MaterialKeys[] = [PRESET_PERSONAL_INFO_GENDER_KEY, MULTIPLE_PIC_SELECT_KEY]

export const defaultStatusMap = (() => {
    const map = {
        [SINGLE_SELECT_KEY]: singleSelectDefaultStatus(),
        [MULTIPLE_SELECT_KEY]: multipleSelectDefaultStatus(),
        [SINGLE_PIC_SELECT_KEY]: singlePicSelectDefaultStatus(),
        [MULTIPLE_PIC_SELECT_KEY]: singlePicSelectDefaultStatus(),
        [TEXT_NODE_KEY]: textNodeDefaultStatus(),
        [PRESET_PERSONAL_INFO_GENDER_KEY]: singleSelectDefaultStatus()
    }

    for (const key of keyToInit) {
        // 如果有值才进行初始化
        if (map[key]) {
            updateInitStatusBeforeAdd(map[key], key)
        }
    }

    return map
})()
