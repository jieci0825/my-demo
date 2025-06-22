const parse = require('./parse')
const tokenize = require('./tokenize')

const markdownText = `
# 这是一个标题

这是一个段落。

## 这是另一个标题

这是另一个段落。

## 这是第三个标题

- 列表项 1
- 列表项 2
- 列表项 3

---这是一段分割的内容---

1. 西瓜
2. 苹果
3. 橙子
`

function markdownToHtml(markdownText) {
    const tokens = tokenize(markdownText)
    const ast = parse(tokens)
    console.log(ast)
}

const htmlContent = markdownToHtml(markdownText)
console.log(htmlContent)
