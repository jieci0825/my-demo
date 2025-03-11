import path from 'node:path'
import fg from 'fast-glob'
import type { Plugin } from 'vite'

const importGlobRE = /\bimport\.meta\.jcGlob\((.*)\)/g

export interface Options {}

// 导出插件
export default function (options: Options = {}): Plugin {
    return {
        name: 'vite-plugin-jc-glob',
        transform(code, id) {
            const matchs = Array.from(code.matchAll(importGlobRE))
            if (!matchs.length) return

            for (const m of matchs) {
                // m[0] 是整个匹配项  m[1] 是括号内的内容
                const glob = m[1].slice(1, -1)

                const scanDir = path.dirname(id)
                const files = fg.sync(glob, { dot: true, cwd: scanDir })

                const startIndex = m.index!
                const endIndex = startIndex + m[0].length

                // 替换
                //  - 实际就是把在使用的位置 import.meta.jcGlob<ModuleType>('./fixtures/*.ts') 这个字符串替换为我们要的内容
                // const replaceContent = "欲买挂花同载酒，终不似，少年游!"
                const replaceContent = `{ ${files.map(file => `'${file}': ()=> import('${file}')`).join(', ')} }`
                code = code.slice(0, startIndex) + replaceContent + code.slice(endIndex)

                console.log(code)

                return code
            }
        }
    }
}
