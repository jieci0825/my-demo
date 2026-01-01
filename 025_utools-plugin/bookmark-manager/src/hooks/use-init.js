import { isDev } from '@/configs'
import { dbTool, getBookmarks } from '@/utils'
import { useTheme } from './use-theme'
import { ref } from 'vue'

export const useInit = () => {
    const bookmarks = ref([])
    // 进入插件时携带的初始搜索关键词
    const initialKeyword = ref('')

    if (isDev) {
        const docs = dbTool.allDocs()
        console.log('DB: ', docs)
    }

    const { isDark, setTheme } = useTheme()
    setTheme(isDark.value)

    if (window.utools) {
        window.utools?.onPluginEnter(action => {
            bookmarks.value = getBookmarks(action)
            // 如果是 over 类型进入，payload 就是用户输入的搜索关键词
            if (action.type === 'over' && action.payload) {
                // 去除可能的命令前缀（bmc、bme、bm，按长度倒序匹配）
                let keyword = action.payload
                const prefixes = ['bmc ', 'bme ', 'bm ']
                for (const prefix of prefixes) {
                    if (keyword.toLowerCase().startsWith(prefix)) {
                        keyword = keyword.slice(prefix.length)
                        break
                    }
                }
                initialKeyword.value = keyword.trim()
            } else {
                initialKeyword.value = ''
            }
        })
    } else {
        console.warn('非 utools 环境，使用开发模式')
    }

    return {
        bookmarks,
        initialKeyword
    }
}
