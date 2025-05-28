;(function () {
    const article = document.querySelector('article')
    // 没有获取到则返回
    if (!article) return

    // 获取文章内容
    const text = article.textContent

    const state = {
        prevLanguage: '',
        currLanguage: '',
        count: 0
    }

    for (let i = 0; i < text.length; i++) {
        // 循环开始前记录上一个字符的状态
        state.prevLanguage = state.currLanguage

        // 字符
        const char = text[i]

        // 判断当前字符状态
        if (char.match(/[a-zA-Z]/)) {
            // * 英语整个单词算一个字符
            state.currLanguage = 'english'
            // 如果上一次状态不是 english 则计数，反之不计数
            if (state.prevLanguage !== 'english') {
                state.count++
            }
        } else if (char.match(/[^\s\n]/)) {
            state.currLanguage = 'other'
            state.count++
        } else {
            // 空白符、换行符不计数
            state.currLanguage = 'null'
        }
    }

    // 计算时间
    const time = Math.round(state.count / 200)
    // 显示时间
    const timeElement = document.createElement('p')
    timeElement.style.fontSize = '14px'
    timeElement.style.color = 'var(--text-active)'
    timeElement.textContent = `阅读时间：${time} 分钟 --- 总字符数：${state.count}(单词整体算一个字符串)`

    // 在元素后面插入阅读时间节点
    const heading = article.querySelector('h1')
    // 查找 time 元素，如果存在则获取其父元素
    const date = article.querySelector('time')?.parentNode

    ;(date || heading).insertAdjacentElement('afterend', timeElement)
})()
