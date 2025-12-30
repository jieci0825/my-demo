import { isDev } from '@/configs'
import { dbTool } from '@/utils'
import { useTheme } from './use-theme'

export const useInit = () => {
    if (isDev) {
        const docs = dbTool.allDocs()
        console.log('DB: ', docs)
    }

    const { isDark, setTheme } = useTheme()
    setTheme(isDark.value)
}
