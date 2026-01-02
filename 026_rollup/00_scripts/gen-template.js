/**
 * 生成模板
 * 1. 接受目录名作为参数
 * 2. 在当前工作目录下创建这个目录，如果目录不存在则创建
 * 3. 将 base-template 目录下的所有文件复制到这个目录下
 */

import path from 'path'
import fs from 'fs'

function main() {
    const args = process.argv.slice(2)
    const dirName = args[0]

    if (!dirName) {
        console.error('请输入目录名')
        process.exit(1)
    }

    const dirPath = path.join(process.cwd(), dirName)
    fs.mkdirSync(dirPath, { recursive: true })

    // esm 下不能使用 __dirname，需要使用 import.meta.url
    const __dirname = new URL('.', import.meta.url).pathname
    fs.cpSync(path.join(__dirname, 'base-template'), dirPath, {
        recursive: true
    })

    console.log(`模板已生成到 ${dirPath}`)
}

main()
