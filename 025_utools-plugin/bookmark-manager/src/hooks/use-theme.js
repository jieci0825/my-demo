import { dbTool } from '@/utils'
import { ref } from 'vue'

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getInitTheme() {
    const savedConfig = dbTool.get('settings') || {}
    const theme = savedConfig?.theme || getSystemTheme()
    return theme
}

export const useTheme = () => {
    const isDark = ref(getInitTheme())

    const toggleTheme = () => {
        isDark.value = !isDark.value
        setTheme(isDark.value)
    }

    function setTheme(theme) {
        document.documentElement.classList.toggle('dark', theme)
        const savedConfig = dbTool.get('settings') || {}
        savedConfig.theme = theme
        return dbTool.set('settings', savedConfig)
    }

    return {
        isDark,
        toggleTheme,
        setTheme
    }
}
