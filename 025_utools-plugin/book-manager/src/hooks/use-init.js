import { isDev } from '@/configs'
import { dbTool } from '@/utils'

export const useInit = () => {
    if (isDev) {
        const docs = dbTool.allDocs()
        console.log('DB: ', docs)
    }
}
