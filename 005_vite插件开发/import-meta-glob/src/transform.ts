import path from 'node:path'
import MagicString from 'magic-string'
import FastGlob from 'fast-glob'
import { Parser } from 'acorn'
import type { ArrayExpression, Literal, ObjectExpression, SequenceExpression } from 'estree'

export interface GlobOptins<Eager extends boolean> {
    as?: string
    eager?: Eager
}

// 全局正则匹配
//  - 匹配 import.meta.jcGlob('xxxxx') 这种字符串
const importGlobRE = /\bimport\.meta\.jcGlob(?:<\w+>)?\(([\s\S]*?)\)/g

// 前缀
const importPrefix = '__vite_glob_jc_'

export function transform(code: string, id: string) {
    const matchs = Array.from(code.matchAll(importGlobRE))
    if (!matchs.length) return

    const s = new MagicString(code)

    // 设置一个 id，达到类似命名空间的效果
    //  - 防止一个页面中使用多个 jcGlob 时且开启了 eager 导致的顶部导入变量名冲突
    let countId = 0
    for (const m of matchs) {
        // m[0] 是整个匹配项  m[1] 是括号内的内容
        const globArgsString = `(${m[1].trim()})`
        const ast = Parser.parse(globArgsString, {
            ecmaVersion: 'latest',
            sourceType: 'module'
        })

        // @ts-expect-error let me do it
        const body = ast.body[0].expression as Literal | ArrayExpression | SequenceExpression
        // arg1 表示第一个参数; arg2 表示第二个参数
        // import.meta.jcGlob<ModuleType>(['./fixtures/*.ts', '!**/index.ts'], { eager: true})
        let arg1 = undefined
        let arg2: ObjectExpression | undefined = undefined

        // - 如果是 SequenceExpression，则表示有两个参数
        if (body.type === 'SequenceExpression') {
            arg1 = body.expressions[0]
            arg2 = body.expressions[1] as unknown as ObjectExpression
        } else {
            // 不是则表示只有一个参数 body 就是 arg1
            arg1 = body
        }

        const globs: string[] = []
        if (arg1.type === 'ArrayExpression') {
            for (const element of arg1.elements) {
                if (element && element.type === 'Literal') {
                    globs.push(element.value as string)
                }
            }
        } else {
            // @ts-ignore
            globs.push(arg1.value as string)
        }

        // 开始处理第二个参数
        const options: GlobOptins<boolean> = {}
        if (arg2) {
            for (const property of arg2.properties) {
                // @ts-ignore
                options[property.key.name] = property.value.value
            }
        }

        // const glob = m[1].slice(1, -1)

        // 扫描目录
        const scanDir = path.dirname(id)
        // const files = FastGlob.sync(glob, { dot: true, cwd: scanDir })
        // 快速扫描出目录下的所有文件
        const files = FastGlob.sync(globs, { dot: true, cwd: scanDir })

        // 保存匹配到的位置
        const startIndex = m.index!
        const endIndex = startIndex + m[0].length

        // 获取第二个参数中的 as，如果有的话
        //  - 组装为 ?raw 的形式，导入时 import('./fixtures/1.ts?raw')
        const query = options.as ? `?${options.as}` : ''

        // 替换
        //  - 实际就是把在使用的位置 import.meta.jcGlob<ModuleType>('./fixtures/*.ts') 这个字符串替换为我们要的内容
        // const replaceContent = "欲买挂花同载酒，终不似，少年游!"
        // - 使用 import.meta.glob 的语法，把文件名作为 key，文件内容作为 value，文件内容通过动态 import('xxxx') 引入

        // * 如果 eager 是 true，则表示立即加载
        if (options.eager) {
            // 生成顶部的导入语句重命名后的变量名
            const importAsName = `${importPrefix}${countId}_`

            // 生成顶部的导入语句，导入这个变量
            const imports = files
                .map((file, idx) => `import * as ${importAsName}${idx} from "${file}${query}"`)
                .join('\n')
            // 加入到顶部-需要添加换行符，避免原本文件顶部有其他导入的时候，导致位置不对
            s.prepend(imports + '\n')

            // 生成替换的内容-导入语句之间换成变量即可
            const replaceContent = `{ \n${files.map((file, idx) => `'${file}': ${importAsName}${idx}`).join(',\n')} \n}`
            s.overwrite(startIndex, endIndex, replaceContent)
        } else {
            const replaceContent = `{ \n${files
                .map(file => `'${file}': ()=> import('${file}${query}')`)
                .join(',\n')} \n}`
            s.overwrite(startIndex, endIndex, replaceContent)
        }

        // ! 直接替换会导致 sourceMap 失效
        // code = code.slice(0, startIndex) + replaceContent + code.slice(endIndex)

        // * 使用 MagicString 可以解决 sourceMap 失效的问题
        // s.overwrite(startIndex, endIndex, replaceContent)

        // !命名空间变量自增
        countId++
    }

    return {
        code: s.toString(),
        map: s.generateMap({ hires: true })
    }
}
