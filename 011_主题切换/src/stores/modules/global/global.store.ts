import { defineStore } from 'pinia'
import type { GlobalState } from './global.type'
import type { ObjToKeyValueArray } from '../../../types/utils'

export const useGlobalStore = defineStore('jc-global', {
    state: (): GlobalState => ({
        // 是否是暗黑模式
        isDark: false
    }),
    actions: {
        setGlobalState(...args: ObjToKeyValueArray<GlobalState>) {
            const [key, value] = args
            this.$patch({ [key]: value })
        }
    },
    persist: true
})

export type GlobalStoreInstance = ReturnType<typeof useGlobalStore>
