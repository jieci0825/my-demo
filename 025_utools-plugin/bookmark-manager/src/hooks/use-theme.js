import { dbTool } from '@/utils'
import { ref } from 'vue'

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getInitTheme() {
    const theme = dbTool.get('theme') || getSystemTheme()
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
        return dbTool.set('theme', theme)
    }

    return {
        isDark,
        toggleTheme,
        setTheme
    }
}
