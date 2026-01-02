/**
 * 清除 dist 目录下的所有文件
 */

import fs from 'fs'
import path from 'path'

function main() {
    const distPath = path.join(process.cwd(), 'dist')
    if (fs.existsSync(distPath)) {
        fs.readdirSync(distPath).forEach(file => {
            fs.unlinkSync(path.join(distPath, file))
        })
    }
    console.log('dist 目录已清除')
}

main()
