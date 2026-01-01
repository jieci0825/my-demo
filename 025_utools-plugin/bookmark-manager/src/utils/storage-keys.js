/**
 * 存储 key 统一管理模块
 * 所有需要持久化存储的 key 都应在此定义
 */

// ===================== 静态 Key =====================

/** 用户设置配置（浏览器路径、主题等） */
export const SETTINGS_KEY = 'settings'

/** 用户自定义标签列表 */
export const TAGS_KEY = 'tags'

/** URL 使用统计 */
export const URL_USAGE_COUNT_KEY = 'urlUsageCount'

// ===================== 动态 Key 生成函数 =====================

/**
 * 获取书签数据缓存的存储 key
 * @param {string} browser - 浏览器类型 ('chrome' | 'edge')
 * @returns {string} 存储 key
 */
export function getBookmarksKey(browser) {
    return `bookmarks_${browser}`
}

/**
 * 获取书签文件最后修改时间的存储 key
 * @param {string} browser - 浏览器类型 ('chrome' | 'edge')
 * @returns {string} 存储 key
 */
export function getBookmarkLastModifiedKey(browser) {
    return `bookmarkLastModified_${browser}`
}
