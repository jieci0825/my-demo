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
                // 去除可能的 "bm " 前缀（仅在进入时处理）
                let keyword = action.payload
                if (keyword.toLowerCase().startsWith('bm ')) {
                    keyword = keyword.slice(3)
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
