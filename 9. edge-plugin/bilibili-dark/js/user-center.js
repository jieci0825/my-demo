;(function () {
    chrome.runtime.onMessage.addListener(function (request) {
        if (request.action === 'openDark') {
            openDark()
        } else if (request.action === 'closeDark') {
            closeDark()
        }
    })

    const JC_BILIBILI_IS_DARK_KEY = 'JC_BILIBILI_IS_DARK'

    const container = document.documentElement

    function init() {
        const isDark = getLocal(JC_BILIBILI_IS_DARK_KEY)
        if (isDark || isDark === null) {
            openDark()
        }
    }
    init()

    function openDark() {
        setLocal(JC_BILIBILI_IS_DARK_KEY, true)
        delayExecute(userCenter)
    }

    function delayExecute(fn, delay = 100) {
        setTimeout(fn, delay)
    }

    // 适配个人中心
    function userCenter() {
        const els = getUserElements()
        // #23272f #343a46 #ebecf0
        els.contianer.style.backgroundColor = '#23272f'
        els.securityRight.style.backgroundColor = '#23272f'
        els.securityContent.style.backgroundColor = '#343a46'
        els.topHeader.style.filter = 'brightness(0.6) contrast(1.2)'

        // 字体颜色
        els.securityContent.style.color = '#ebecf0'
        els.homeTopMsgName.style.color = '#fff'
        ;[...els.homeDialyTaksTitles, ...els.reExpInfos, ...els.currentBNums, ...els.securityNavNames].forEach(el => {
            el.style.color = '#ebecf0'
        })

        // 边框色
        ;[
            els.homeDailyTaskWarp,
            els.indexInfo,
            els.securityRight,
            els.homeMp,
            els.securityContent,
            ...els.hLines
        ].forEach(el => {
            el.style.borderColor = '#343a46'
        })
        ;[...els.securityUls, ...els.securityListJumps].forEach(el => {
            el.style.borderColor = '#88929f'
        })

        const style = document.createElement('style')
        style.innerHTML = `
    .security-left .on.on{
        background-color: #18171D !important;
    }`
        container.appendChild(style)
    }

    // 清除个人中心适配
    function clearUserCenter() {
        const els = getUserElements()
        els.contianer.style.backgroundColor = ''
        els.securityRight.style.backgroundColor = ''
        els.securityContent.style.backgroundColor = ''
        els.topHeader.style.filter = 'none'

        els.securityContent.style.color = ''
        els.homeTopMsgName.style.color = ''
        ;[...els.homeDialyTaksTitles, ...els.reExpInfos, ...els.currentBNums, ...els.securityNavNames].forEach(el => {
            el.style.color = ''
        })
        ;[
            els.homeDailyTaskWarp,
            els.indexInfo,
            els.securityRight,
            els.homeMp,
            els.securityContent,
            els.securityUls,
            ...els.hLines,
            ...els.securityListJumps
        ].forEach(el => {
            el.style.borderColor = ''
        })
    }

    function getUserElements() {
        const securityRight = document.querySelector('.security-right')
        const securityContent = document.querySelector('.security_content')
        const contianer = document.body
        const topHeader = document.querySelector('.top-header')
        const homeTopMsgName = document.querySelector('.home-top-msg-name')
        const homeDialyTaksTitles = document.querySelectorAll('.home-dialy-task-title')
        const reExpInfos = document.querySelectorAll('.re-exp-info')
        const currentBNums = document.querySelectorAll('.curren-b-num')
        const homeDailyTaskWarp = document.querySelector('.home-daily-task-warp')
        const indexInfo = document.querySelector('.index-info')
        const homeMp = document.querySelector('.home-mp')
        const securityNavNames = document.querySelectorAll('.security-nav-name')
        const hLines = document.querySelectorAll('.h-line')
        const securityUls = document.querySelectorAll('.security-ul')
        const securityListJumps = document.querySelectorAll('.security-list-jump')

        return {
            securityRight,
            securityContent,
            contianer,
            topHeader,
            homeTopMsgName,
            homeDialyTaksTitles,
            reExpInfos,
            currentBNums,
            homeDailyTaskWarp,
            indexInfo,
            homeMp,
            securityNavNames,
            hLines,
            securityUls,
            securityListJumps
        }
    }

    function closeDark() {
        setLocal(JC_BILIBILI_IS_DARK_KEY, false)
        clearUserCenter()
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
})()
