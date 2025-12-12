// DOM Elements
const inputText = document.getElementById('inputText')
const clearBtn = document.getElementById('clearBtn')
const parseBtn = document.getElementById('parseBtn')
const downloadBtn = document.getElementById('downloadBtn')
const resultSection = document.getElementById('resultSection')
const loadingSection = document.getElementById('loadingSection')
const errorSection = document.getElementById('errorSection')
const errorMessage = document.getElementById('errorMessage')
const toast = document.getElementById('toast')
const toastMessage = document.getElementById('toastMessage')

// 视频信息元素
const videoCover = document.getElementById('videoCover')
const videoTitle = document.getElementById('videoTitle')
const videoAuthor = document.getElementById('videoAuthor')
const videoNote = document.getElementById('videoNote')
const platformBadge = document.getElementById('platformBadge')

// 存储解析结果
let videoData = null

// API 地址
const API_BASE = 'http://localhost:3000'

// 平台正则表达式
const urlPatterns = [
    /https?:\/\/v\.douyin\.com\/[a-zA-Z0-9]+/i,
    /https?:\/\/(?:www\.)?douyin\.com\/video\/\d+/i,
    /https?:\/\/b23\.tv\/[a-zA-Z0-9]+/i,
    /https?:\/\/(?:www\.)?bilibili\.com\/video\/[a-zA-Z0-9]+/i,
    /https?:\/\/m\.bilibili\.com\/video\/[a-zA-Z0-9]+/i,
    /https?:\/\/(?:www\.)?xhslink\.com\/[a-zA-Z0-9\/]+/i,
    /https?:\/\/(?:www\.)?xiaohongshu\.com\/(?:explore|discovery\/item)\/[a-zA-Z0-9]+/i,
    /https?:\/\/v\.ixigua\.com\/[a-zA-Z0-9]+/i,
    /https?:\/\/(?:www\.)?ixigua\.com\/\d+/i
]

// 防抖定时器
let extractTimer = null

// 初始化事件监听
function init() {
    inputText.addEventListener('paste', handlePaste)
    inputText.addEventListener('input', handleInput)
    clearBtn.addEventListener('click', handleClear)
    parseBtn.addEventListener('click', handleParse)
    downloadBtn.addEventListener('click', handleDownload)
}

// 处理粘贴事件 - 自动提取链接
function handlePaste(e) {
    // 延迟执行，等待粘贴内容写入
    setTimeout(() => {
        autoExtractUrl()
    }, 50)
}

// 处理输入变化 - 防抖自动提取
function handleInput() {
    // 清除之前的定时器
    if (extractTimer) {
        clearTimeout(extractTimer)
    }

    // 设置新的定时器（300ms 后执行）
    extractTimer = setTimeout(() => {
        autoExtractUrl()
    }, 300)
}

// 自动提取链接
function autoExtractUrl() {
    const text = inputText.value

    // 如果已经是纯链接，不处理
    if (text.startsWith('http://') || text.startsWith('https://')) {
        const lines = text.split('\n')
        if (lines.length === 1 && extractUrl(text) === text.trim()) {
            return
        }
    }

    const extractedUrl = extractUrl(text)

    if (extractedUrl && extractedUrl !== text.trim()) {
        inputText.value = extractedUrl
        showToast('已提取链接', 'success')
    }
}

// 从文本中提取链接
function extractUrl(text) {
    for (const pattern of urlPatterns) {
        const match = text.match(pattern)
        if (match) {
            return cleanUrl(match[0])
        }
    }
    return null
}

// 清理URL
function cleanUrl(url) {
    return url.replace(/[.,;:!?'")\]}>]+$/, '').trim()
}

// 清空
function handleClear() {
    inputText.value = ''
    videoData = null
    resultSection.classList.add('hidden')
    loadingSection.classList.add('hidden')
    errorSection.classList.add('hidden')
    downloadBtn.disabled = true
    showToast('已清空', 'success')
}

// 解析视频
async function handleParse() {
    const url = inputText.value.trim()

    if (!url) {
        showToast('请先粘贴视频链接', 'warning')
        return
    }

    // 验证是否为有效链接
    const validUrl = extractUrl(url)
    if (!validUrl) {
        showToast('无法识别的链接格式', 'error')
        return
    }

    // 显示加载状态，隐藏其他区域
    showLoading(true)
    resultSection.classList.add('hidden')
    errorSection.classList.add('hidden')
    downloadBtn.disabled = true

    try {
        const response = await fetch(`${API_BASE}/api/parse`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: validUrl })
        })

        const data = await response.json()

        if (data.success) {
            videoData = data
            displayResult(data)
            downloadBtn.disabled = false
            showToast('解析成功', 'success')
        } else {
            showError(data.error || '解析失败')
        }
    } catch (error) {
        console.error('解析错误:', error)
        showError('网络错误，请检查服务是否启动')
    } finally {
        showLoading(false)
    }
}

// 显示错误信息
function showError(message) {
    errorMessage.textContent = message
    errorSection.classList.remove('hidden')
    resultSection.classList.add('hidden')
    showToast(message, 'error')
}

// 显示解析结果
function displayResult(data) {
    resultSection.classList.remove('hidden')

    // 设置封面
    if (data.cover) {
        videoCover.src = data.cover
        videoCover.style.display = 'block'
    } else {
        videoCover.style.display = 'none'
    }

    // 设置平台标签
    platformBadge.textContent = data.platformName
    platformBadge.className = `platform-badge ${data.platform}`

    // 设置标题
    videoTitle.textContent = data.title || '未知标题'

    // 设置作者
    videoAuthor.querySelector('span').textContent = data.author || '未知作者'

    // 设置备注
    if (data.note) {
        videoNote.textContent = data.note
        videoNote.classList.remove('hidden')
    } else {
        videoNote.classList.add('hidden')
    }
}

// 下载视频
async function handleDownload() {
    if (!videoData || !videoData.videoUrl) {
        showToast('请先解析视频', 'warning')
        return
    }

    showToast('正在准备下载...', 'info')

    try {
        // 构建下载URL
        const downloadUrl = new URL(`${API_BASE}/api/download`)
        downloadUrl.searchParams.set('url', videoData.videoUrl)
        downloadUrl.searchParams.set('filename', videoData.title || 'video')

        if (videoData.needReferer && videoData.referer) {
            downloadUrl.searchParams.set('referer', videoData.referer)
        }

        // 创建隐藏的a标签进行下载
        const a = document.createElement('a')
        a.href = downloadUrl.toString()
        a.download = `${videoData.title || 'video'}.mp4`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        showToast('开始下载', 'success')
    } catch (error) {
        console.error('下载错误:', error)
        showToast('下载失败', 'error')
    }
}

// 显示/隐藏加载状态
function showLoading(show) {
    if (show) {
        loadingSection.classList.remove('hidden')
        parseBtn.disabled = true
    } else {
        loadingSection.classList.add('hidden')
        parseBtn.disabled = false
    }
}

// 显示提示消息
function showToast(message, type = 'info') {
    toastMessage.textContent = message
    toast.className = `toast ${type}`

    toast.classList.remove('hidden')
    void toast.offsetWidth
    toast.classList.add('show')

    setTimeout(() => {
        toast.classList.remove('show')
        setTimeout(() => {
            toast.classList.add('hidden')
        }, 300)
    }, 2500)
}

// 初始化
init()
