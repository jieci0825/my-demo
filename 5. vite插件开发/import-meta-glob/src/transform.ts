import path from 'node:path'
import MagicString from 'magic-string'
import FastGlob from 'fast-glob'
import { Parser } from 'acorn'
import type { ArrayExpression, Literal } from 'estree'

// 全局正则匹配
//  - 匹配 import.meta.jcGlob('xxxxx') 这种字符串
const importGlobRE = /\bimport\.meta\.jcGlob(?:<\w+>)?\(([\s\S]*?)\)/g

export function transform(code: string, id: string) {
    const matchs = Array.from(code.matchAll(importGlobRE))
    if (!matchs.length) return

    const s = new MagicString(code)
    for (const m of matchs) {
        // m[0] 是整个匹配项  m[1] 是括号内的内容
        const globArgsString = `(${m[1].trim()})`
        const ast = Parser.parse(globArgsString, {
            ecmaVersion: 'latest',
            sourceType: 'module'
        })

        // @ts-expect-error let me do it
        const body = ast.body[0].expression as Literal | ArrayExpression
        const globs: string[] = []
        if (body.type === 'ArrayExpression') {
            for (const element of body.elements) {
                if (element && element.type === 'Literal') {
                    globs.push(element.value as string)
                }
            }
        } else {
            globs.push(body.value as string)
        }

        console.log(globs)

        // const glob = m[1].slice(1, -1)

        // 扫描目录
        const scanDir = path.dirname(id)
        // const files = FastGlob.sync(glob, { dot: true, cwd: scanDir })
        // 快速扫描出目录下的所有文件
        const files = FastGlob.sync(globs, { dot: true, cwd: scanDir })

        // 保存匹配到的位置
        const startIndex = m.index!
        const endIndex = startIndex + m[0].length

        // 替换
        //  - 实际就是把在使用的位置 import.meta.jcGlob<ModuleType>('./fixtures/*.ts') 这个字符串替换为我们要的内容
        // const replaceContent = "欲买挂花同载酒，终不似，少年游!"
        // - 使用 import.meta.glob 的语法，把文件名作为 key，文件内容作为 value，文件内容通过动态 import('xxxx') 引入
        const replaceContent = `{ ${files.map(file => `'${file}': ()=> import('${file}')`).join(', ')} }`

        // ! 直接替换会导致 sourceMap 失效
        // code = code.slice(0, startIndex) + replaceContent + code.slice(endIndex)

        // * 使用 MagicString 可以解决 sourceMap 失效的问题
        s.overwrite(startIndex, endIndex, replaceContent)
    }
    return {
        code: s.toString(),
        map: s.generateMap({ hires: true })
    }
}
