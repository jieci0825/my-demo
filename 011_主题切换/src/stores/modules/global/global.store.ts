import { defineStore } from 'pinia'
import type { GlobalState } from './global.type'
import type { ObjToKeyValueArray } from '@/types/utils'

export const useGlobalStore = defineStore('global', {
    state: (): GlobalState => ({
        // 是否是暗黑模式
        isDark: false,
        // 开启跟随系统主题
        followSystem: false
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
