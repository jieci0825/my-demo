import { transform } from './transform'
import type { Plugin } from 'vite'

export interface Options {}

// 导出插件
export default function (options?: Options): Plugin {
    return {
        name: 'vite-plugin-jc-glob',
        transform(code, id) {
            return transform(code, id)
        }
    }
}
