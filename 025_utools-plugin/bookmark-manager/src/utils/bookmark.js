import dbTool from './storage'
import {
    SETTINGS_KEY,
    getBookmarksKey,
    getBookmarkLastModifiedKey
} from './storage-keys'

/**
 * 根据命令代码获取需要加载的浏览器列表
 * @param {string} code 命令代码 ('bm' | 'bmc' | 'bme')
 * @returns {string[]} 浏览器列表
 */
function getBrowsersByCode(code) {
    const browserMap = {
        bmc: ['chrome'],
        bme: ['edge'],
        bm: ['chrome', 'edge']
    }
    return browserMap[code] || ['chrome', 'edge']
}

/**
 * 获取书签
 * @param {object|boolean} actionOrForceRefresh utools 插件进入时的 action 对象，或者布尔值表示强制刷新
 * @param {boolean} forceRefreshParam 是否强制刷新，跳过缓存检查（仅当第一个参数是 action 对象时使用）
 */
export function getBookmarks(
    actionOrForceRefresh = {},
    forceRefreshParam = false
) {
    let action = {}
    let forceRefresh = false

    if (typeof actionOrForceRefresh === 'boolean') {
        forceRefresh = actionOrForceRefresh
    } else {
        action = actionOrForceRefresh || {}
        forceRefresh = forceRefreshParam
    }

    const flattenedBookmarks = []
    const browsers = getBrowsersByCode(action.code)

    for (const browser of browsers) {
        const bookmarks = processBookmarks(browser, forceRefresh)
        flattenedBookmarks.push(...bookmarks)
    }

    return flattenedBookmarks
}

/**
 * 处理单个浏览器书签
 * @param {string} browser 浏览器类型
 * @param {boolean} forceRefresh 是否强制刷新
 */
function processBookmarks(browser, forceRefresh = false) {
    // 1. 获取书签文件路径
    const bookmarkFilePath = getBookmarkFilePath(browser)

    if (!bookmarkFilePath) {
        return []
    }

    // 2. 检查是否需要更新（强制刷新时跳过检查）
    if (!forceRefresh) {
        const fileMetadata = services.getFileMetadata(bookmarkFilePath)
        const needUpdate = checkNeedUpdateBookmarks(fileMetadata, browser)

        if (!needUpdate) {
            const bookmarks = dbTool.get(getBookmarksKey(browser))
            return bookmarks || []
        }
    }

    // 3. 读取并处理书签
    const bookmarksTree = getBookmarksTree(bookmarkFilePath)

    // 如果读取失败，返回缓存数据
    if (!bookmarksTree) {
        const cachedBookmarks = dbTool.get(getBookmarksKey(browser))
        return cachedBookmarks || []
    }

    const flattenedBookmarks = flattenBookmarks(bookmarksTree, browser)

    dbTool.set(getBookmarksKey(browser), flattenedBookmarks)

    return flattenedBookmarks
}

/**
 * 检测是否需要更新书签
 */
function checkNeedUpdateBookmarks(fileMetadata, browserType) {
    const { mtimeMs } = fileMetadata

    const key = getBookmarkLastModifiedKey(browserType)

    const lastModified = dbTool.get(key)

    if (!lastModified) {
        dbTool.set(key, mtimeMs)
        return true
    }

    // 如果上次修改时间与本次修改时间相同，则不需要更新本次更新时间
    if (lastModified === mtimeMs) {
        return false
    }

    // 将本次的修改时间存入本地
    dbTool.set(key, mtimeMs)

    return true
}

/**
 * 打平书签树结构，为每个节点添加来源属性
 * @param {object} bookmarksTree 书签树对象
 * @param {string} browserType 浏览器类型 ('edge' 或 'chrome')
 */
function flattenBookmarks(bookmarksTree, browserType) {
    const flattened = []

    if (bookmarksTree) {
        Object.keys(bookmarksTree).forEach(rootKey => {
            const rootNode = bookmarksTree[rootKey]
            flattenNode(rootNode, rootKey, browserType, flattened, [])
        })
    }

    return flattened
}

/**
 * 递归打平单个节点
 * @param {object} node 当前节点
 */
function flattenNode(node, rootKey, browserSource, result, path) {
    if (!node) return

    // 只有type为url的节点才加入到最终结果中
    if (node.type === 'url') {
        // 创建当前节点的副本并添加来源和路径信息
        const flattenedNode = {
            ...node,
            browser: browserSource,
            rootKey,
            tags: [],
            alias: '',
            path: [...path],
            fullPath: [...path, node.name].join(' > ')
        }

        // 添加到结果数组
        result.push(flattenedNode)
    }

    // 如果有子节点，递归处理（无论当前节点是否为url类型）
    if (node.children && Array.isArray(node.children)) {
        const newPath = [...path, node.name]
        node.children.forEach(child => {
            flattenNode(child, rootKey, browserSource, result, newPath)
        })
    }
}

/**
 * 获取书签树
 * @param {string} bookmarkFilePath 书签文件路径
 * @returns {object} 书签树
 */
function getBookmarksTree(bookmarkFilePath) {
    if (!bookmarkFilePath) {
        return null
    }
    let tree = null
    const bookmarks = services.readFile(bookmarkFilePath)
    if (!bookmarks) {
        return null
    }
    try {
        tree = JSON.parse(bookmarks)
        tree = tree.roots
    } catch (error) {
        console.error('解析书签树失败: ', error)
        return null
    }
    return tree
}

/**
 * 获取书签文件的完整路径
 * 优先使用本地存储的文件路径，如果不存在则根据平台获取默认文件路径
 */
function getBookmarkFilePath(browser) {
    const settings = dbTool.get(SETTINGS_KEY) || {}

    const browserPathKey = `${browser}Path`

    // 1. 如果本地存在该浏览器的文件路径，直接使用
    if (settings[browserPathKey]) {
        return settings[browserPathKey]
    }

    // 2. 本地不存在，根据平台处理
    const osPlatform = services.getOSPlatform()
    const supportedPlatforms = ['darwin', 'win32']

    // 如果不在支持的平台列表中，直接返回 null
    if (!supportedPlatforms.includes(osPlatform)) {
        return null
    }

    // 查找默认文件路径并存储
    const defaultFilePath = findDefaultBookmarkFilePath(browser, osPlatform)
    if (defaultFilePath) {
        settings[browserPathKey] = defaultFilePath
        dbTool.set(SETTINGS_KEY, settings)
        return defaultFilePath
    }

    return null
}

/**
 * 获取 appDataPath
 */
function getAppDataPath(platform) {
    const appDataPath = utools.getPath('appData')
    if (platform === 'win32') {
        return appDataPath.replace('Roaming', 'Local')
    }
    return appDataPath
}

/**
 * 查找默认书签文件路径
 */
function findDefaultBookmarkFilePath(browser, platform) {
    const appDataPath = getAppDataPath(platform)

    const browserDirMap = {
        darwin: {
            chrome: 'Google/Chrome',
            edge: 'Microsoft Edge'
        },
        win32: {
            chrome: 'Google/Chrome/User Data',
            edge: 'Microsoft/Edge/User Data'
        }
    }

    const platformDirs = browserDirMap[platform]
    if (!platformDirs) {
        return null
    }

    const browserDir = platformDirs[browser]
    if (!browserDir) {
        return null
    }

    const bookmarkDirPath = services.resolvePath(appDataPath, browserDir)

    // 在不同的 Profile 中查找 Bookmarks 文件
    const profiles = ['Default', 'Profile 3', 'Profile 2', 'Profile 1']
    for (const profile of profiles) {
        const filePath = services.resolvePath(
            bookmarkDirPath,
            profile,
            'Bookmarks'
        )
        if (services.fileExists(filePath)) {
            return filePath
        }
    }

    return null
}

/**
 * 更新书签项的属性
 */
export function updateBookmarkProperty({ guid, browser, key, value }) {
    // 1. 获取对应浏览器的书签数据
    const bookmarks = dbTool.get(getBookmarksKey(browser))

    if (!bookmarks || !Array.isArray(bookmarks)) {
        console.warn(`未找到 ${browser} 浏览器的书签数据`)
        return false
    }

    // 2. 找到匹配的书签项
    const bookmarkIndex = bookmarks.findIndex(item => item.guid === guid)

    if (bookmarkIndex === -1) {
        console.warn(`未找到 guid 为 ${guid} 的书签项`)
        return false
    }

    // 3. 更新指定的属性
    bookmarks[bookmarkIndex][key] = value

    // 4. 保存回本地存储
    dbTool.set(getBookmarksKey(browser), bookmarks)

    return true
}
