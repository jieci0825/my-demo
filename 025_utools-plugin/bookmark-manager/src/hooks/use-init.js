import { isDev } from '@/configs'
import { dbTool, getBookmarks } from '@/utils'
import { useTheme } from './use-theme'
import { ref } from 'vue'

export const useInit = (callbacks = {}) => {
    const bookmarks = ref([])

    if (isDev) {
        const docs = dbTool.allDocs()
        console.log('DB: ', docs)
    }

    const { isDark, setTheme } = useTheme()
    setTheme(isDark.value)

    if (window.utools) {
        window.utools?.onPluginEnter(action => {
            bookmarks.value = getBookmarks(action)

            let initialKeyword = ''
            if (action.type === 'over' && action.payload) {
                let keyword = action.payload
                const prefixes = ['bmc ', 'bme ', 'bm ']
                for (const prefix of prefixes) {
                    if (keyword.toLowerCase().startsWith(prefix)) {
                        keyword = keyword.slice(prefix.length)
                        break
                    }
                }
                initialKeyword = keyword.trim()
            }

            callbacks.onEnter?.(initialKeyword)
        })
    } else {
        console.warn('非 utools 环境，使用开发模式')
        callbacks.onEnter?.('')
    }

    return {
        bookmarks
    }
}
