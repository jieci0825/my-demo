import { toValue } from 'vue'
import { isArray, isObject, isString } from './check-type'

/** 存储前缀 */
const APP_PREFIX = 'utools/bookManager/'

/** 设备ID缓存（避免重复获取） */
let _deviceId = null

/**
 * 获取当前设备ID
 * 使用 utools.getNativeId() 获取设备唯一标识
 * @returns {string} 设备ID
 */
function getDeviceId() {
    if (_deviceId === null) {
        try {
            _deviceId = utools.getNativeId() || 'default'
        } catch (error) {
            console.warn('获取设备ID失败，使用默认值:', error)
            _deviceId = 'default'
        }
    }
    return _deviceId
}

/**
 * 生成完整的文档ID
 * 格式: utools/bookManager/{deviceId}/{key}
 * @param {string} key - 存储 key
 * @returns {string} 完整的文档ID
 */
function getDocId(key) {
    if (!isString(key)) {
        throw new Error('dbTool: key must be a non-empty string')
    }
    const deviceId = getDeviceId()
    return `${APP_PREFIX}${deviceId}/${key}`
}

const dbTool = {
    /**
     * 获取当前设备ID
     * @returns {string} 设备ID
     */
    getDeviceId,

    /**
     * 获取存储值
     * @param {string} key - 存储 key（应使用 storage-keys.js 中定义的常量）
     * @returns {any} 存储的值，不存在则返回 null
     */
    get(key) {
        const id = getDocId(key)
        try {
            const doc = utools.db.get(id)
            return doc ? doc.value : null
        } catch (error) {
            console.error('dbTool.get error:', error)
            return null
        }
    },

    /**
     * 设置存储值
     * @param {string} key - 存储 key（应使用 storage-keys.js 中定义的常量）
     * @param {any} value - 要存储的值
     * @returns {boolean} 是否成功
     */
    set(key, value) {
        const id = getDocId(key)

        let rawValue = toValue(value)

        if (isArray(rawValue) || isObject(rawValue)) {
            rawValue = JSON.parse(JSON.stringify(rawValue))
        }

        try {
            // 读出已有 doc（为了获取 _rev）
            let existing = utools.db.get(id)

            // 组装数据
            const doc = {
                _id: id,
                value: rawValue
            }

            // 如果已有，则带上 _rev 进行覆盖
            if (existing && existing._rev) {
                doc._rev = existing._rev
            }

            const result = utools.db.put(doc)
            return result && result.ok === true
        } catch (error) {
            console.error('dbTool.set error:', error)
            return false
        }
    },

    /**
     * 删除存储值
     * @param {string} key - 存储 key（应使用 storage-keys.js 中定义的常量）
     * @returns {boolean} 是否成功
     */
    remove(key) {
        const id = getDocId(key)
        try {
            const doc = utools.db.get(id)
            if (!doc) return false

            const result = utools.db.remove(doc)
            return result && result.ok === true
        } catch (err) {
            console.error('dbTool.remove error:', err)
            return false
        }
    },

    /**
     * 清除当前设备的所有存储数据
     * @returns {number} 删除的文档数量
     */
    clear() {
        try {
            const deviceId = getDeviceId()
            const prefix = `${APP_PREFIX}${deviceId}/`
            // 批量读出所有符合前缀的 docs
            const docs = utools.db.allDocs(prefix)
            let count = 0
            for (const doc of docs) {
                try {
                    const r = utools.db.remove(doc)
                    if (r && r.ok) count++
                } catch (ignore) {}
            }
            return count
        } catch (err) {
            console.error('dbTool.clear error:', err)
            return 0
        }
    },

    /**
     * 获取当前设备的所有存储文档
     * @returns {Array} 文档列表
     */
    allDocs() {
        const deviceId = getDeviceId()
        const prefix = `${APP_PREFIX}${deviceId}/`
        return utools.db.allDocs(prefix)
    }
}

export default dbTool
