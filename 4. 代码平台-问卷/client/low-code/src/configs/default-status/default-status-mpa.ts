import singleSelectDefaultStatus from './single-select'
import singlePicSelectDefaultStatus from './single-pic-select'
import textNodeDefaultStatus from './text-node'
import {
    SINGLE_PIC_SELECT_KEY,
    SINGLE_SELECT_KEY,
    TEXT_NODE_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    MULTIPLE_SELECT_KEY,
    MULTIPLE_PIC_SELECT_KEY,
    OPTION_SELECT_KEY,
    TEXT_INPUT_KEY
} from '@/constants'
import { updateInitStatusBeforeAdd } from '@/utils'
import type { MaterialKeys } from '@/types/materials'

const keyToInit: MaterialKeys[] = [
    PRESET_PERSONAL_INFO_GENDER_KEY,
    MULTIPLE_SELECT_KEY,
    MULTIPLE_PIC_SELECT_KEY,
    OPTION_SELECT_KEY,
    TEXT_INPUT_KEY
]

export const defaultStatusMap = (() => {
    const map = {
        [OPTION_SELECT_KEY]: singleSelectDefaultStatus(),
        [SINGLE_SELECT_KEY]: singleSelectDefaultStatus(),
        [MULTIPLE_SELECT_KEY]: singleSelectDefaultStatus(),
        [SINGLE_PIC_SELECT_KEY]: singlePicSelectDefaultStatus(),
        [MULTIPLE_PIC_SELECT_KEY]: singlePicSelectDefaultStatus(),
        [TEXT_NODE_KEY]: textNodeDefaultStatus(),
        [PRESET_PERSONAL_INFO_GENDER_KEY]: singleSelectDefaultStatus(),
        [TEXT_INPUT_KEY]: textNodeDefaultStatus()
    }

    for (const key of keyToInit) {
        if (map[key]) {
            updateInitStatusBeforeAdd(map[key], key)
        }
    }

    return map
})()
