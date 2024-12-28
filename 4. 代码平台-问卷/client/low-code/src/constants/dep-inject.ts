import type { InjectionKey } from 'vue'

export const UPDATE_STATE: InjectionKey<(key: string, value: any) => void> = Symbol('UPDATE_STATE')
