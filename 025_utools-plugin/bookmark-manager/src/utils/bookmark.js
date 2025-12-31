import dbTool from './storage'

/**
 * 获取书签
 */
export function getBookmarks() {
    const bookmarkDirPath = getBookmarkDirPathByOSPlatform()

    const flattenedBookmarks = []

    for (const browser in bookmarkDirPath) {
        const bookmarks = processBookmarks(bookmarkDirPath[browser], browser)
        flattenedBookmarks.push(...bookmarks)
    }

    return flattenedBookmarks
}

/**
 * 处理单个浏览器书签
 */
function processBookmarks(bookmarkPath, browser) {
    const bookmarkFilePath = getBookmarkFilePath(bookmarkPath)

    if (!bookmarkFilePath) {
        return []
    }

    const fileMetadata = services.getFileMetadata(bookmarkFilePath)
    const needUpdate = checkNeedUpdateBookmarks(fileMetadata, browser)

    if (!needUpdate) {
        const bookmarks = dbTool.get(`bookmarks_${browser}`)
        return bookmarks
    }

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
 * 获取书签目录中真正的书签文件路径
 */
function getBookmarkFilePath(bookmarkDirPath) {
    const profiles = ['Default', 'Profile 3', 'Profile 2', 'Profile 1']
    const profile = profiles.find(profile => {
        return services.fileExists(
            services.resolvePath(bookmarkDirPath, profile, 'Bookmarks')
        )
    })
    if (!profile) {
        return null
    }
    return services.resolvePath(bookmarkDirPath, profile, 'Bookmarks')
}

/**
 * 根据平台获取书签目录路径
 */
function getBookmarkDirPathByOSPlatform() {
    const osPlatform = services.getOSPlatform()

    const bookmarkPath = {
        chrome: '',
        edge: ''
    }
    if (osPlatform === 'win32') {
        // TODO:
    } else if (osPlatform === 'darwin') {
        bookmarkPath.chrome = services.resolvePath(
            utools.getPath('appData'),
            'Google/Chrome'
        )
        bookmarkPath.edge = services.resolvePath(
            utools.getPath('appData'),
            'Microsoft Edge'
        )
    } else {
        // TODO: 其他平台
    }

    return bookmarkPath
}
