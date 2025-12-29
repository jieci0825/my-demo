import { renderMD } from '../src/helpers/audit/renderMD.js'
import { readFileSync } from 'node:fs'

// 读取用户提供的完整数据
const fullAuditData = JSON.parse(readFileSync('./test/audit-data.json', 'utf-8'))

try {
    console.log('开始生成完整Markdown报告...')
    const mdContent = renderMD(fullAuditData)
    console.log('✅ 完整Markdown报告生成成功！')

    // 保存到文件
    const { writeFileSync } = await import('node:fs')
    writeFileSync('./test/sample-report.md', mdContent)
    console.log('📄 报告已保存到: ./test/sample-report.md')

    console.log('报告长度:', mdContent.length, '字符')
    console.log('报告预览 (前1000字符):')
    console.log('=' .repeat(60))
    console.log(mdContent.substring(0, 1000) + '...')
    console.log('=' .repeat(60))

} catch (error) {
    console.error('❌ 测试失败:', error.message)
    console.error(error.stack)
}
