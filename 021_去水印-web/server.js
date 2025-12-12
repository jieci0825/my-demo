const express = require('express')
const cors = require('cors')
const axios = require('axios')
const path = require('path')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname)))

// 平台识别正则
const platformPatterns = {
    douyin: [
        /https?:\/\/v\.douyin\.com\/[a-zA-Z0-9]+/i,
        /https?:\/\/(?:www\.)?douyin\.com\/video\/\d+/i
    ],
    bilibili: [
        /https?:\/\/b23\.tv\/[a-zA-Z0-9]+/i,
        /https?:\/\/(?:www\.)?bilibili\.com\/video\/[a-zA-Z0-9]+/i,
        /https?:\/\/m\.bilibili\.com\/video\/[a-zA-Z0-9]+/i
    ],
    xiaohongshu: [
        /https?:\/\/(?:www\.)?xhslink\.com\/[a-zA-Z0-9\/]+/i,
        /https?:\/\/(?:www\.)?xiaohongshu\.com\/(?:explore|discovery\/item)\/[a-zA-Z0-9]+/i
    ],
    xigua: [
        /https?:\/\/v\.ixigua\.com\/[a-zA-Z0-9]+/i,
        /https?:\/\/(?:www\.)?ixigua\.com\/\d+/i
    ]
}

// 识别平台
function detectPlatform(url) {
    for (const [platform, patterns] of Object.entries(platformPatterns)) {
        for (const pattern of patterns) {
            if (pattern.test(url)) {
                return platform
            }
        }
    }
    return null
}

// 获取平台名称
function getPlatformName(platform) {
    const names = {
        douyin: '抖音',
        bilibili: 'B站',
        xiaohongshu: '小红书',
        xigua: '西瓜视频'
    }
    return names[platform] || '未知'
}

// 解析抖音视频
async function parseDouyin(url) {
    try {
        // 如果是短链接，先获取重定向后的真实链接
        let realUrl = url
        if (url.includes('v.douyin.com')) {
            const response = await axios
                .get(url, {
                    maxRedirects: 0,
                    validateStatus: status => status >= 200 && status < 400,
                    headers: {
                        'User-Agent':
                            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
                    }
                })
                .catch(err => {
                    if (err.response && err.response.headers.location) {
                        return {
                            headers: { location: err.response.headers.location }
                        }
                    }
                    throw err
                })
            realUrl = response.headers.location || url
        }

        // 提取视频ID
        const videoIdMatch = realUrl.match(/video\/(\d+)/)
        if (!videoIdMatch) {
            throw new Error('无法提取视频ID')
        }
        const videoId = videoIdMatch[1]

        // 调用抖音API获取视频信息
        const apiUrl = `https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${videoId}`
        const apiResponse = await axios.get(apiUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
                'Referer': 'https://www.douyin.com/'
            }
        })

        const itemList = apiResponse.data?.item_list
        if (!itemList || itemList.length === 0) {
            throw new Error('未找到视频信息')
        }

        const videoInfo = itemList[0]
        const videoUrl = videoInfo.video?.play_addr?.url_list?.[0]

        if (!videoUrl) {
            throw new Error('无法获取视频地址')
        }

        // 替换水印地址为无水印地址
        const noWatermarkUrl = videoUrl.replace('playwm', 'play')

        return {
            success: true,
            platform: 'douyin',
            platformName: '抖音',
            title: videoInfo.desc || '抖音视频',
            author: videoInfo.author?.nickname || '未知作者',
            cover: videoInfo.video?.cover?.url_list?.[0] || '',
            videoUrl: noWatermarkUrl,
            originalUrl: url
        }
    } catch (error) {
        console.error('抖音解析错误:', error.message)
        return {
            success: false,
            error: error.message || '解析失败'
        }
    }
}

// 解析B站视频
async function parseBilibili(url) {
    try {
        let realUrl = url

        // 如果是短链接，获取重定向
        if (url.includes('b23.tv')) {
            const response = await axios.get(url, {
                maxRedirects: 5,
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            })
            realUrl = response.request.res.responseUrl || url
        }

        // 提取BV号
        const bvMatch = realUrl.match(/BV[a-zA-Z0-9]+/)
        if (!bvMatch) {
            throw new Error('无法提取视频BV号')
        }
        const bvid = bvMatch[0]

        // 获取视频信息
        const infoUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
        const infoResponse = await axios.get(infoUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.bilibili.com/'
            }
        })

        const videoData = infoResponse.data?.data
        if (!videoData) {
            throw new Error('未找到视频信息')
        }

        const cid = videoData.cid

        // 获取视频流地址
        const playUrl = `https://api.bilibili.com/x/player/playurl?bvid=${bvid}&cid=${cid}&qn=80&fnval=1`
        const playResponse = await axios.get(playUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.bilibili.com/'
            }
        })

        const playData = playResponse.data?.data
        const videoUrl = playData?.durl?.[0]?.url

        if (!videoUrl) {
            throw new Error('无法获取视频地址')
        }

        return {
            success: true,
            platform: 'bilibili',
            platformName: 'B站',
            title: videoData.title || 'B站视频',
            author: videoData.owner?.name || '未知作者',
            cover: videoData.pic || '',
            videoUrl: videoUrl,
            originalUrl: url,
            needReferer: true,
            referer: 'https://www.bilibili.com/'
        }
    } catch (error) {
        console.error('B站解析错误:', error.message)
        return {
            success: false,
            error: error.message || '解析失败'
        }
    }
}

// 解析小红书
async function parseXiaohongshu(url) {
    try {
        let realUrl = url

        // 如果是短链接，获取重定向
        if (url.includes('xhslink.com')) {
            const response = await axios.get(url, {
                maxRedirects: 5,
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
                }
            })
            realUrl = response.request.res.responseUrl || url
        }

        // 提取笔记ID
        const noteIdMatch = realUrl.match(
            /(?:explore|discovery\/item)\/([a-zA-Z0-9]+)/
        )
        if (!noteIdMatch) {
            throw new Error('无法提取笔记ID')
        }

        // 小红书的API较为复杂，这里返回提示信息
        return {
            success: true,
            platform: 'xiaohongshu',
            platformName: '小红书',
            title: '小红书视频',
            author: '未知作者',
            cover: '',
            videoUrl: realUrl,
            originalUrl: url,
            note: '小红书视频解析需要登录验证，请使用其他工具下载'
        }
    } catch (error) {
        console.error('小红书解析错误:', error.message)
        return {
            success: false,
            error: error.message || '解析失败'
        }
    }
}

// 解析西瓜视频
async function parseXigua(url) {
    try {
        let realUrl = url

        // 如果是短链接，获取重定向
        if (url.includes('v.ixigua.com')) {
            const response = await axios.get(url, {
                maxRedirects: 5,
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            })
            realUrl = response.request.res.responseUrl || url
        }

        // 提取视频ID
        const videoIdMatch = realUrl.match(/ixigua\.com\/(\d+)/)
        if (!videoIdMatch) {
            throw new Error('无法提取视频ID')
        }

        // 西瓜视频的API较为复杂
        return {
            success: true,
            platform: 'xigua',
            platformName: '西瓜视频',
            title: '西瓜视频',
            author: '未知作者',
            cover: '',
            videoUrl: realUrl,
            originalUrl: url,
            note: '西瓜视频解析较为复杂，请使用其他工具下载'
        }
    } catch (error) {
        console.error('西瓜视频解析错误:', error.message)
        return {
            success: false,
            error: error.message || '解析失败'
        }
    }
}

// 解析视频接口
app.post('/api/parse', async (req, res) => {
    const { url } = req.body

    if (!url) {
        return res.json({
            success: false,
            error: '请提供视频链接'
        })
    }

    const platform = detectPlatform(url)

    if (!platform) {
        return res.json({
            success: false,
            error: '不支持的平台链接'
        })
    }

    let result

    switch (platform) {
        case 'douyin':
            result = await parseDouyin(url)
            break
        case 'bilibili':
            result = await parseBilibili(url)
            break
        case 'xiaohongshu':
            result = await parseXiaohongshu(url)
            break
        case 'xigua':
            result = await parseXigua(url)
            break
        default:
            result = {
                success: false,
                error: '不支持的平台'
            }
    }

    res.json(result)
})

// 代理下载接口（处理跨域和Referer限制）
app.get('/api/download', async (req, res) => {
    const { url, referer, filename } = req.query

    if (!url) {
        return res.status(400).json({ error: '缺少视频URL' })
    }

    try {
        const headers = {
            'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }

        if (referer) {
            headers['Referer'] = referer
        }

        const response = await axios.get(url, {
            responseType: 'stream',
            headers,
            maxRedirects: 5
        })

        // 设置响应头
        res.setHeader(
            'Content-Type',
            response.headers['content-type'] || 'video/mp4'
        )
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${encodeURIComponent(
                filename || 'video'
            )}.mp4"`
        )

        if (response.headers['content-length']) {
            res.setHeader('Content-Length', response.headers['content-length'])
        }

        // 流式传输
        response.data.pipe(res)
    } catch (error) {
        console.error('下载错误:', error.message)
        res.status(500).json({ error: '下载失败: ' + error.message })
    }
})

// 启动服务器
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║   🎬 视频去水印工具已启动                        ║
║                                                ║
║   访问地址: http://localhost:${PORT}              ║
║                                                ║
║   支持平台: 抖音 | B站 | 小红书 | 西瓜视频       ║
║                                                ║
╚════════════════════════════════════════════════╝
    `)
})
