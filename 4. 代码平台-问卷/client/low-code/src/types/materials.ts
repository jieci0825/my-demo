import { SINGLE_SELECT_KEY, SINGLE_PIC_SELECT_KEY, TEXT_NODE_KEY } from '@/constants'

const materialKyes = [SINGLE_SELECT_KEY, SINGLE_PIC_SELECT_KEY, TEXT_NODE_KEY] as const

export type MaterialKeys = (typeof materialKyes)[number]
