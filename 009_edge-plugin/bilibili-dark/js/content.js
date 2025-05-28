// 此文件匹配 *://*.bilibili.com/* 格式的网站。因此可以作为全局仓库。
/**
 * 获取本地存储
 * @param {string} key
 * @returns {string|object|undefined}
 */
function getLocal(key) {
    try {
        return JSON.parse(localStorage.getItem(key))
    } catch (error) {
        return localStorage.getItem(key)
    }
}

/**
 * 设置本地存储
 * @param {string} key
 * @param {object|string} value
 */
function setLocal(key, value) {
    if (!key) return
    try {
        localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
        localStorage.setItem(key, value)
    }
}

/**
 * 延迟执行
 * @param {function} fn 执行的函数
 * @param {number} delay ms
 */
function delayExecute(fn, delay = 100) {
    setTimeout(fn, delay)
}

/**
 * @name JC_BILIBILI_IS_DARK 常量-是否开启暗黑模式
 */
const JC_BILIBILI_IS_DARK_KEY = 'JC_BILIBILI_IS_DARK'

;(function () {
    // 监听来自 popup 的消息
    chrome.runtime.onMessage.addListener(function (request) {
        if (request.action === 'openDark') {
            openDark()
        } else if (request.action === 'closeDark') {
            closeDark()
        }
    })

    const container = document.documentElement

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
        // 给 html 添加自定义属性 data-theme，值为 dark
        container.setAttribute('data-theme', 'dark')
    }

    function closeDark() {
        setLocal(JC_BILIBILI_IS_DARK_KEY, false)
        // 移除 html 的自定义属性 data-theme
        container.removeAttribute('data-theme')
    }
})()
