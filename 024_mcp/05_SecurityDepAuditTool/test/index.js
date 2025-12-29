import path from 'node:path'
import { auditPackage } from '../src/entry/index.js'

const savePath = path.join(process.cwd(), 'result', 'audit.md')

auditPackage(
    '/Users/coderjc/Documents/work/zhiyu/project/everyday-backend',
    savePath
).catch(console.error)

// 测试 gitee 仓库
// auditPackage('https://gitee.com/qwer-li/coderjc-ui', savePath).catch(
//     console.error
// ).then(console.log)

// 测试 github 仓库
// auditPackage('https://github.com/jieci0825/coderjc-cli', savePath).catch(
//     console.error
// ).then(console.log)
