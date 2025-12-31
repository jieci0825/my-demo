/**
 * 高亮文本中的关键词
 * @param {string} text - 原文本
 * @param {string} keywords - 关键词，多个关键词用空格分隔
 * @returns {string} 包含高亮标记的HTML文本
 */
export function highlightText(text, keywords) {
    if (!text || !keywords) {
        return text || ''
    }

    // 转义HTML特殊字符
    let highlightedText = escapeHtml(text)

    // 将关键词按空格分割，并过滤空字符串
    const keywordList = keywords.split(/\s+/).filter(keyword => keyword.trim())

    // 对每个关键词进行高亮
    keywordList.forEach(keyword => {
        // 转义正则表达式特殊字符
        const escapedKeyword = escapeRegExp(keyword)
        // 创建不区分大小写的正则表达式
        const regex = new RegExp(`(${escapedKeyword})`, 'gi')
        // 替换为高亮标记
        highlightedText = highlightedText.replace(
            regex,
            '<span class="text-highlight">$1</span>'
        )
    })

    return highlightedText
}

/**
 * 转义HTML特殊字符
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }

    return text.replace(/[&<>"']/g, char => htmlEntities[char])
}

/**
 * 转义正则表达式特殊字符
 * @param {string} text - 需要转义的文本
 * @returns {string} 转义后的文本
 */
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
