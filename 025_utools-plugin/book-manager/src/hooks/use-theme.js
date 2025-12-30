import { dbTool } from '@/utils'
import { ref } from 'vue'

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function init() {
    const theme = dbTool.get('theme')
    if (theme) {
        return theme
    }
    return getSystemTheme()
}

export const useTheme = () => {
    const isDark = ref(init())

    const toggleTheme = () => {
        isDark.value = !isDark.value
        document.documentElement.classList.toggle('dark', isDark.value)
        dbTool.set('theme', isDark.value)
    }

    return {
        isDark,
        toggleTheme
    }
}
