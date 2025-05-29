import { useGlobalStore } from '@/stores/modules/global'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted } from 'vue'

const media = window.matchMedia('(prefers-color-scheme: dark)')

export const useTheme = () => {
    const globalStore = useGlobalStore()
    const { isDark, followSystem } = storeToRefs(globalStore)

    const toggleTheme = (init?: boolean) => {
        // 如果是初始化，则不需要变动仓库的值，只需要根据当前值来设置样式
        //  - 同时为 true 也表示不需要手动切换主题
        if (!init) {
            globalStore.setGlobalState('isDark', !isDark.value)
            // 而如果进入了这里，则表示开启了手动切换主题，就要关闭跟随系统
            globalStore.setGlobalState('followSystem', false)
        }

        const html = document.documentElement as HTMLElement

        if (isDark.value) {
            html.classList.add('dark')
        } else {
            html.classList.remove('dark')
        }
    }

    const switchFollowSystem = () => {
        globalStore.setGlobalState('followSystem', !followSystem.value)
        // 手动开启或者关闭跟随系统，则需要手动触发一次监听事件
        onDarkModeChange()
    }

    const initTheme = () => {
        toggleTheme(true)
    }

    const onDarkModeChange = () => {
        // 不开启跟随系统，则不处理
        if (!followSystem.value) return
        const isOSDark = media.matches
        globalStore.setGlobalState('isDark', isOSDark)
        toggleTheme(true)
    }

    onMounted(() => {
        initTheme()
        media.addEventListener('change', onDarkModeChange)
    })

    onUnmounted(() => {
        media.removeEventListener('change', onDarkModeChange)
    })

    return { isDark, toggleTheme, initTheme, followSystem, switchFollowSystem }
}
