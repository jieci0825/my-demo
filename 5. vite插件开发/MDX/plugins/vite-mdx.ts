import type { Plugin } from 'vite'
import { compile } from '@mdx-js/mdx'
import { createFilter, type FilterPattern } from '@rollup/pluginutils'

interface Options {
    include?: FilterPattern
    exclude?: FilterPattern
}

export default (options?: Options): Plugin => {
    const config: Options = Object.assign({ include: /\.mdx/, exclude: null }, options)

    const filter = createFilter(config.include, config.exclude)

    return {
        name: 'vite-mdx',

        async transform(code, id, ssr) {
            // 过滤掉不需要编译的文件
            if (filter(id)) {
                // 进行编译
                const result = await compile(code, { format: 'detect', jsxImportSource: 'vue', jsx: true })
                console.log('*********:', result.value)

                return {
                    // 将编译后的代码返回
                    code: result.value as string
                }
            }
        }
    }
}
