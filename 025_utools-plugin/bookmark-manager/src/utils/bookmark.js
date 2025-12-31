import dbTool from './storage'

/**
 * 获取书签
 */
export function getBookmarks() {
    const flattenedBookmarks = []
    const browsers = ['chrome', 'edge']

    for (const browser of browsers) {
        const bookmarks = processBookmarks(browser)
        flattenedBookmarks.push(...bookmarks)
    }

    return flattenedBookmarks
}

/**
 * 处理单个浏览器书签
 */
function processBookmarks(browser) {
    // 1. 获取书签文件路径
    const bookmarkFilePath = getBookmarkFilePath(browser)

    if (!bookmarkFilePath) {
        return []
    }

    // 2. 检查是否需要更新
    const fileMetadata = services.getFileMetadata(bookmarkFilePath)
    const needUpdate = checkNeedUpdateBookmarks(fileMetadata, browser)

    if (!needUpdate) {
        const bookmarks = dbTool.get(`bookmarks_${browser}`)
        return bookmarks || []
    }

    // 3. 读取并处理书签
    const bookmarksTree = getBookmarksTree(bookmarkFilePath)
    const flattenedBookmarks = flattenBookmarks(bookmarksTree, browser)

    dbTool.set(`bookmarks_${browser}`, flattenedBookmarks)

    return flattenedBookmarks
}

/**
 * 检测是否需要更新书签
 */
function checkNeedUpdateBookmarks(fileMetadata, browserType) {
    const { mtimeMs } = fileMetadata

    const key = `bookmarkLastModified_${browserType}`

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
    const key = 'settings'
    const settings = dbTool.get(key) || {}

    const browserPathKey = `${browser}Path`

    // 1. 如果本地存在该浏览器的文件路径，直接使用
    if (settings[browserPathKey]) {
        return settings[browserPathKey]
    }

    // 2. 本地不存在，根据平台处理
    const osPlatform = services.getOSPlatform()

    if (osPlatform === 'darwin') {
        // Mac 系统：查找默认文件路径并存储
        const defaultFilePath = findDefaultBookmarkFilePath(browser)
        if (defaultFilePath) {
            settings[browserPathKey] = defaultFilePath
            dbTool.set(key, settings)
            return defaultFilePath
        }
    } else if (osPlatform === 'win32') {
        // Windows 系统：没有存储路径则停止
        return null
    }

    return null
}

/**
 * 查找默认书签文件路径（仅 Mac 系统）
 */
function findDefaultBookmarkFilePath(browser) {
    const appDataPath = utools.getPath('appData')

    const browserDirMap = {
        chrome: 'Google/Chrome',
        edge: 'Microsoft Edge'
    }

    const browserDir = browserDirMap[browser]
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
