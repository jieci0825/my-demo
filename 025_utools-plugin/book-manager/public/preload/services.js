const fs = require('node:fs')
const path = require('node:path')

// 通过 window 对象向渲染进程注入 nodejs 能力
window.services = {
    // 读文件
    readFile(file) {
        return fs.readFileSync(file, { encoding: 'utf-8' })
    },
    // 文本写入到下载目录
    writeTextFile(text) {
        const filePath = path.join(
            window.utools.getPath('downloads'),
            Date.now().toString() + '.txt'
        )
        fs.writeFileSync(filePath, text, { encoding: 'utf-8' })
        return filePath
    },
    // 图片写入到下载目录
    writeImageFile(base64Url) {
        const matchs = /^data:image\/([a-z]{1,20});base64,/i.exec(base64Url)
        if (!matchs) return
        const filePath = path.join(
            window.utools.getPath('downloads'),
            Date.now().toString() + '.' + matchs[1]
        )
        fs.writeFileSync(filePath, base64Url.substring(matchs[0].length), {
            encoding: 'base64'
        })
        return filePath
    },
    // 路径拼接
    resolvePath(...args) {
        return path.resolve(...args)
    },
    // 获取当前os平台
    getOSPlatform() {
        return process.platform
    },
    // 检测文件是否存在
    fileExists(path) {
        return fs.existsSync(path)
    }
}
