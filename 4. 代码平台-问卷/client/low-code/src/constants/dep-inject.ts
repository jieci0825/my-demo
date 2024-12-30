import type { InjectionKey } from 'vue'

export const UPDATE_STATE: InjectionKey<(key: string, payload?: any) => void> = Symbol('UPDATE_STATE')
