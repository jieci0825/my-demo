// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === 'openDark') {
        openDark()
    } else if (request.action === 'closeDark') {
        closeDark()
    }
})

const JC_BILIBILI_IS_DARK_KEY = 'JC_BILIBILI_IS_DARK'

const container = document.documentElement
const body = document.body
const a1s = document.querySelectorAll('body a')

const cssDarkMap = {
    '--Wh0': '#23272f',
    '--Ga11': '#23272f',
    '--Ga1': '#333a45',
    '--Ga7': '#ebecf0',
    '--Ga1_s': '#343a46',
    '--Ga10': '#f6f7f9',
    '--Ga0_s': '#343a46',
    '--Ga2': '#343a46',
    '--Ga0': '#343a46',
    '--Ga12': '#343a46',
    '--Ga12_s': '#343a46'
}

function init() {
    const isDark = getLocal(JC_BILIBILI_IS_DARK_KEY)
    // 为 null 表示是第一次打开，因此默认设置为暗黑模式
    // 为 false 则表示用户主动关闭了暗黑模式，不开启
    if (isDark || isDark === null) {
        openDark()
    }
}
init()

function openDark() {
    setLocal(JC_BILIBILI_IS_DARK_KEY, true)
    coverCssVariable()
    // 还有一些需要单独设置
    for (const a of a1s) {
        a.style.setProperty('color', '#ebecf0')
    }

    // 给当前页面添加一个 style
    const style = document.createElement('style')
    style.innerHTML = `.float-button.float-button{
        box-shadow: 0 0 10px  #727b7e;
    }`
    container.appendChild(style)
}

function coverCssVariable() {
    for (let key in cssDarkMap) {
        container.style.setProperty(key, cssDarkMap[key])
    }
}

function closeDark() {
    setLocal(JC_BILIBILI_IS_DARK_KEY, false)
    for (let key in cssDarkMap) {
        container.style.removeProperty(key)
    }
    for (const a of a1s) {
        a.style.removeProperty('color')
    }
}

function getLocal(key) {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch (error) {
        return localStorage.getItem(key)
    }
}

function setLocal(key, value) {
    if (!key) return
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        localStorage.setItem(key, value)
    }
}
