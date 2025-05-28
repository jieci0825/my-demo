import { useGlobalStore } from '@/stores/modules/global'
import { storeToRefs } from 'pinia'

export const useTheme = () => {
    const globalStore = useGlobalStore()
    const { isDark } = storeToRefs(globalStore)

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark')

        globalStore.setGlobalState('isDark', !isDark.value)
    }

    return {
        isDark,
        toggleTheme
    }
}
