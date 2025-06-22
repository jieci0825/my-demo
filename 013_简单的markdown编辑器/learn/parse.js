function parse(tokens) {
    const ast = {
        type: 'root',
        children: []
    }

    // 当前列表项
    let currentListItem = null

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]

        switch (token.type) {
            // 标题和段落
            case 'heading':
            case 'paragraph':
                {
                    ast.children.push(token)
                }
                break
            // 列表
            case 'list-item': {
                const _type = token.ordered ? 'ordered-list' : 'unordered-list'

                // 如果存在当前列表项的父项，且类型标识符合预期，则直接添加子元素
                if (currentListItem && currentListItem.type === _type) {
                    currentListItem.children.push({
                        type: 'list-item',
                        content: token.content
                    })
                } else {
                    // 否则则创建一个列表项的父元素，并加入
                    currentListItem = {
                        type: _type,
                        children: [token],
                        ordered: token.ordered
                    }
                    ast.children.push(currentListItem)
                }
                break
            }
        }
    }

    return ast
}

module.exports = parse
