function tokenize(markdownText) {
    const lines = markdownText.split('\n')

    const tokens = []

    for (const line of lines) {
        // 解析行：判断属于哪个 markdown 语法
        if (line.startsWith('#')) {
            // 匹配所有 # 号，看看是几级标题
            const [level] = line.match(/^#+/)
            const titleNum = level.length
            // 获取标题的文本
            const titleText = line.slice(titleNum).trim()
            tokens.push({
                type: 'heading',
                level: titleNum,
                content: titleText
            })
        } else if (line.startsWith('- ')) {
            // 无序列表解析
            const text = line.slice(2).trim()
            tokens.push({
                type: 'list-item',
                ordered: false,
                content: text
            })
        }
        // 解析有序列表，检测本行是否以数字和 . 开头
        else if (/^\d+\./.test(line)) {
            const text = line.slice(2).trim()
            tokens.push({
                type: 'list-item',
                ordered: true,
                content: text
            })
        }
        // 解析段落
        else if (line.trim() !== '') {
            tokens.push({
                type: 'paragraph',
                content: line.trim()
            })
        }
    }

    return tokens
}

module.exports = tokenize
