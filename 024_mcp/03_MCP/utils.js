import fs from 'node:fs'
import path from 'node:path'

function sum({ a, b }) {
    return a + b
}

function createFile({ filename, content }) {
    // 在当前目录下创建文件
    const filePath = path.join(process.cwd(), filename)
    fs.writeFileSync(filePath, content)
    return `文件创建成功: ${filePath}`
}

export default {
    sum,
    createFile
}
