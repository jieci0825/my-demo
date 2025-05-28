import type { PicLink } from '@/types'
import type { InjectionKey } from 'vue'

export const UPDATE_STATE: InjectionKey<(key: string, payload?: any) => void> = Symbol('UPDATE_STATE')
export const GET_PIC_LINK: InjectionKey<(payload: PicLink) => any> = Symbol('GET_PIC_LINK')
export const PIC_BEFORE_UPLOAD_INTERCEPTOR: InjectionKey<() => { flag: boolean; message?: string }> = Symbol(
    'PIC_BEFORE_UPLOAD_INTERCEPTOR'
)
