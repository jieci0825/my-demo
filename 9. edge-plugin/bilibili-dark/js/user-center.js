// 使用自执行函数，防止变量污染
;(function () {
    chrome.runtime.onMessage.addListener(function (request) {
        if (request.action === 'openDark') {
            openDark()
        } else if (request.action === 'closeDark') {
            closeDark()
        }
    })

    const container = document.documentElement
    const styleId = '__jc_dark_user_center_home_style__'

    function init() {
        isEnableDark()
        watchRoute()
    }
    init()

    // 监听路由变化
    function watchRoute() {
        window.addEventListener('popstate', e => {
            isEnableDark()
        })
    }

    function isEnableDark() {
        const isDark = getLocal(JC_BILIBILI_IS_DARK_KEY)
        if (isDark) {
            openDark()
        }
    }

    function openDark() {
        setLocal(JC_BILIBILI_IS_DARK_KEY, true)
        delayExecute(userCenterHome)
    }

    // 适配个人中心-主页
    function userCenterHome() {
        const els = getUserCenterHomeElements()
        // #23272f #343a46 #ebecf0
        els.contianer.style.backgroundColor = '#23272f'
        els.securityRight.style.backgroundColor = '#23272f'
        els.securityContent.style.backgroundColor = '#343a46'
        els.topHeader.style.filter = 'brightness(0.6) contrast(1.2)'

        // 字体颜色
        ;[...els.hRewardInfos, ...els.hSafeTitles, els.homeTopMsgName].forEach(el => {
            el.style.color = '#fff'
        })
        ;[
            ...els.homeDialyTaksTitles,
            ...els.reExpInfos,
            ...els.currentBNums,
            ...els.securityNavNames,
            els.securityContent
        ].forEach(el => {
            el.style.color = '#ebecf0'
        })

        // 边框色
        ;[
            els.homeDailyTaskWarp,
            els.indexInfo,
            els.securityRight,
            els.homeMp,
            els.securityContent,
            els.securityTitle,
            ...els.hLines
        ].forEach(el => {
            el.style.borderColor = '#343a46'
        })
        ;[...els.securityUls, ...els.securityListJumps].forEach(el => {
            el.style.borderColor = '#88929f'
        })

        const style = document.createElement('style')
        style.id = styleId
        style.innerHTML = `
    .security-left .on.on{
        background-color: #3a465e !important;
    }
    .security-list:hover{
        background-color: #515f7a !important;
    }
    `
        container.appendChild(style)
    }

    // 清除个人中心-主页 适配
    function clearuserCenterHome() {
        const els = getUserCenterHomeElements()
        els.contianer.style.backgroundColor = ''
        els.securityRight.style.backgroundColor = ''
        els.securityContent.style.backgroundColor = ''
        els.topHeader.style.filter = 'none'

        els.securityContent.style.color = ''
        els.homeTopMsgName.style.color = ''
        ;[
            ...els.hRewardInfos,
            ...els.hSafeTitles,
            els.homeTopMsgName,
            ...els.homeDialyTaksTitles,
            ...els.reExpInfos,
            ...els.currentBNums,
            ...els.securityNavNames,
            els.securityContent
        ].forEach(el => {
            el.style.color = ''
        })
        ;[
            els.homeDailyTaskWarp,
            els.indexInfo,
            els.securityRight,
            els.homeMp,
            els.securityContent,
            els.securityTitle,
            ...els.securityUls,
            ...els.hLines,
            ...els.securityListJumps
        ].forEach(el => {
            el.style.borderColor = ''
        })
        const style = document.getElementById(styleId)
        if (style) {
            style.remove()
        }
    }

    // 获取个人中心-主页 元素
    function getUserCenterHomeElements() {
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
        const securityTitle = document.querySelector('.security-title')
        const hRewardInfos = document.querySelectorAll('.h-reward-info')
        const hSafeTitles = document.querySelectorAll('.h-safe-title')

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
            securityListJumps,
            securityTitle,
            hRewardInfos,
            hSafeTitles
        }
    }

    function closeDark() {
        setLocal(JC_BILIBILI_IS_DARK_KEY, false)
        clearuserCenterHome()
    }
})()
