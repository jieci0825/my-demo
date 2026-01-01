/**
 * 高亮文本中的关键词
 * @param {string} text - 原文本
 * @param {string} keywords - 关键词，多个关键词用空格分隔
 * @param {boolean} splitChar - 是否开启单字符拆分高亮，默认 false
 * @returns {string} 包含高亮标记的HTML文本
 */
export function highlightText(text, keywords, splitChar = false) {
    if (!text || !keywords) {
        return text || ''
    }

    // 转义HTML特殊字符
    let highlightedText = escapeHtml(text)

    // 将关键词按空格分割，并过滤空字符串
    const keywordList = keywords.split(/\s+/).filter(keyword => keyword.trim())

    if (keywordList.length === 0) {
        return highlightedText
    }

    // 根据 splitChar 决定匹配模式
    let pattern
    if (splitChar) {
        // 单字符拆分：将所有关键词拆成单个字符并去重
        const chars = [...new Set(keywordList.join('').split(''))]
        pattern = chars.map(char => escapeRegExp(char)).join('|')
    } else {
        // 整词匹配：匹配完整的关键词
        pattern = keywordList.map(keyword => escapeRegExp(keyword)).join('|')
    }

    const regex = new RegExp(`(${pattern})`, 'gi')

    // 替换为高亮标记
    highlightedText = highlightedText.replace(
        regex,
        '<span class="text-highlight">$1</span>'
    )

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
