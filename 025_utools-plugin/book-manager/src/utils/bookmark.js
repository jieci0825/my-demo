export function getBookmarks() {
    const bookmarkDirPath = getBookmarkDirPathByOSPlatform()

    const edgeBookmarkFilePath = getBookmarkFilePath(bookmarkDirPath.edge)
    const chromeBookmarkFilePath = getBookmarkFilePath(bookmarkDirPath.chrome)

    const edgeBookmarksTree = getBookmarksTree(edgeBookmarkFilePath)
    const chromeBookmarksTree = getBookmarksTree(chromeBookmarkFilePath)

    const flattenedBookmarks = flattenBookmarks(
        edgeBookmarksTree,
        chromeBookmarksTree
    )

    return flattenedBookmarks
}

/**
 * 打平书签树结构，为每个节点添加来源属性
 */
function flattenBookmarks(edgeBookmarksTree, chromeBookmarksTree) {
    const flattened = []

    // 处理Edge书签
    if (edgeBookmarksTree) {
        Object.keys(edgeBookmarksTree).forEach(rootKey => {
            const rootNode = edgeBookmarksTree[rootKey]
            flattenNode(rootNode, rootKey, 'edge', flattened, [])
        })
    }

    // 处理Chrome书签
    if (chromeBookmarksTree) {
        Object.keys(chromeBookmarksTree).forEach(rootKey => {
            const rootNode = chromeBookmarksTree[rootKey]
            flattenNode(rootNode, rootKey, 'chrome', flattened, [])
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
        edge: '',
        chrome: ''
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
