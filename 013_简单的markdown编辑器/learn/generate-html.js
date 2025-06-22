function generateHtml(ast) {
    const result = parseNode(ast)
    return result
}

function parseNode(node) {
    if (node.type === 'root') {
        return node.children.map(child => parseNode(child)).join('')
    } else if (node.type === 'paragraph') {
        return `<p>${node.content}</p>`
    } else if (node.type === 'heading') {
        // 根据对应的标题等级，生成对应的标题
        return `<h${node.level}>${node.content}</h${node.level}>`
    } else if (node.type === 'unordered-list' || node.type === 'ordered-list') {
        // 确定有序列表和无需列表标签
        const tagName = node.ordered ? 'ol' : 'ul'

        const items = node.children.map(item => `<li>${parseNode(item)}</li>`).join('')

        // 返回完整的列表标签
        return `<${tagName}>${items}</${tagName}>`
    }
}

module.exports = generateHtml
