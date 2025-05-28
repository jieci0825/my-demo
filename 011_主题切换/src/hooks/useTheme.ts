import { useGlobalStore } from '@/stores/modules/global'
import { storeToRefs } from 'pinia'

export const useTheme = () => {
    const globalStore = useGlobalStore()
    const { isDark } = storeToRefs(globalStore)

    const toggleTheme = (init?: boolean) => {
        // 如果是初始化，则不需要变动仓库的值，只需要根据当前值来设置样式
        if (!init) {
            globalStore.setGlobalState('isDark', !isDark.value)
        }

        const html = document.documentElement as HTMLElement

        if (isDark.value) {
            html.classList.add('dark')
        } else {
            html.classList.remove('dark')
        }
    }

    const initTheme = () => {
        toggleTheme(true)
    }

    return { isDark, toggleTheme, initTheme }
}
