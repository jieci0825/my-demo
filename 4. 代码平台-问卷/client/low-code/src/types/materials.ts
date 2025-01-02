import {
    SINGLE_SELECT_KEY,
    SINGLE_PIC_SELECT_KEY,
    TEXT_NODE_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    MULTIPLE_SELECT_KEY,
    MULTIPLE_PIC_SELECT_KEY
} from '@/constants'

const materialKyes = [
    SINGLE_SELECT_KEY,
    SINGLE_PIC_SELECT_KEY,
    TEXT_NODE_KEY,
    PRESET_PERSONAL_INFO_GENDER_KEY,
    MULTIPLE_SELECT_KEY,
    MULTIPLE_PIC_SELECT_KEY
] as const

export type MaterialKeys = (typeof materialKyes)[number]
