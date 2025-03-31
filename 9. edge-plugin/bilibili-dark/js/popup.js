const texts = ['欢迎使用哔哩哔哩暗黑主题插件！', 'Author: CoderJc']
function log(text) {
    console.log(
        `%c${text}`,
        'color: #fff; background-color: #009688; font-size: 16px; padding: 5px; border-radius: 4px;'
    )
}
texts.forEach(log)

const openDarkBtn = document.querySelector('#open-dark')
const closeDarkBtn = document.querySelector('#close-dark')
const tips = document.querySelector('.tips')

openDarkBtn.addEventListener('click', async () => {
    const tab = await getBiliBiliTab()
    if (!tab) return
    chrome.tabs.sendMessage(tab.id, { action: 'openDark' })
})

closeDarkBtn.addEventListener('click', async () => {
    const tab = await getBiliBiliTab()
    if (!tab) return
    chrome.tabs.sendMessage(tab.id, { action: 'closeDark' })
})

function setTips(text) {
    tips.textContent = text
}

function getBiliBiliTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            // 给负责哔哩哔哩的站点的js脚本发送消息- tabs[0] 是当前激活的标签页
            if (tabs.length) {
                resolve(tabs[0])
            } else {
                resolve(null)
                // setTips('没有找到哔哩哔哩的页面')
            }
        })
    })
}
