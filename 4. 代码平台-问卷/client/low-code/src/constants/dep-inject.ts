import type { PicLink } from '@/types'
import type { InjectionKey } from 'vue'

export const UPDATE_STATE: InjectionKey<(key: string, payload?: any) => void> = Symbol('UPDATE_STATE')
export const GET_PIC_LINK: InjectionKey<(payload: PicLink) => any> = Symbol('GET_PIC_LINK')
