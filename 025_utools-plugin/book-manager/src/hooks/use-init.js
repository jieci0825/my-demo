import { isDev } from '@/configs'
import { dbTool, getBookmarks } from '@/utils'
import { useTheme } from './use-theme'

export const useInit = () => {
    let bookmarks = []

    if (isDev) {
        const docs = dbTool.allDocs()
        console.log('DB: ', docs)
    }

    const { isDark, setTheme } = useTheme()
    setTheme(isDark.value)

    if (window.utools) {
        window.utools?.onPluginEnter(action => {
            bookmarks = getBookmarks(action)
        })
    } else {
        console.warn('非 utools 环境，使用开发模式')
    }

    return {
        bookmarks
    }
}
