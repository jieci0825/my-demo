import { dbTool, SETTINGS_KEY } from '@/utils'

/**
 * 配置项默认值
 */
const DEFAULT_CONFIG = {
    chromePath: '',
    edgePath: '',
    sortType: 'default',
    matchType: 'multiple',
    theme: false,
    splitCharHighlight: false
}

/**
 * 单例实例
 */
let instance = null

/**
 * 创建配置管理器
 */
function createSettingsManager() {
    // 回调注册表：Map<callback, Set<key>>
    // 使用 callback 作为 key，方便去重执行
    const callbackToKeys = new Map()

    // 反向索引：Map<key, Set<callback>>
    // 用于快速查找某个 key 对应的所有回调
    const keyToCallbacks = new Map()

    /**
     * 获取当前配置
     * @returns {object}
     */
    function getConfig() {
        const saved = dbTool.get(SETTINGS_KEY)
        return { ...DEFAULT_CONFIG, ...saved }
    }

    /**
     * 注册配置变更监听器
     * @param {string | string[]} keys - 监听的配置项
     * @param {function} callback - 回调函数，参数为 { key, oldValue, newValue }
     * @returns {function} 取消监听的函数
     */
    function on(keys, callback) {
        const keyList = Array.isArray(keys) ? keys : [keys]

        // 记录 callback 监听的 keys
        if (!callbackToKeys.has(callback)) {
            callbackToKeys.set(callback, new Set())
        }
        const callbackKeys = callbackToKeys.get(callback)

        // 建立双向索引
        keyList.forEach(key => {
            callbackKeys.add(key)

            if (!keyToCallbacks.has(key)) {
                keyToCallbacks.set(key, new Set())
            }
            keyToCallbacks.get(key).add(callback)
        })

        // 返回取消监听函数
        return () => off(keys, callback)
    }

    /**
     * 移除配置变更监听器
     * @param {string | string[]} keys - 监听的配置项
     * @param {function} callback - 回调函数
     */
    function off(keys, callback) {
        const keyList = Array.isArray(keys) ? keys : [keys]

        keyList.forEach(key => {
            // 从 keyToCallbacks 移除
            if (keyToCallbacks.has(key)) {
                keyToCallbacks.get(key).delete(callback)
                if (keyToCallbacks.get(key).size === 0) {
                    keyToCallbacks.delete(key)
                }
            }

            // 从 callbackToKeys 移除
            if (callbackToKeys.has(callback)) {
                callbackToKeys.get(callback).delete(key)
                if (callbackToKeys.get(callback).size === 0) {
                    callbackToKeys.delete(callback)
                }
            }
        })
    }

    /**
     * 对比两个配置对象，返回变化的字段
     * @param {object} oldConfig
     * @param {object} newConfig
     * @returns {Array<{ key: string, oldValue: any, newValue: any }>}
     */
    function diffConfig(oldConfig, newConfig) {
        const changes = []
        const allKeys = new Set([
            ...Object.keys(oldConfig),
            ...Object.keys(newConfig)
        ])

        allKeys.forEach(key => {
            const oldValue = oldConfig[key]
            const newValue = newConfig[key]

            // 简单的深度比较（对于对象/数组使用 JSON 序列化）
            const oldStr = JSON.stringify(oldValue)
            const newStr = JSON.stringify(newValue)

            if (oldStr !== newStr) {
                changes.push({ key, oldValue, newValue })
            }
        })

        return changes
    }

    /**
     * 保存配置并触发变更回调
     * @param {object} newConfig - 新配置
     * @returns {Promise<boolean>} 是否保存成功
     */
    async function save(newConfig) {
        const oldConfig = getConfig()
        const success = dbTool.set(SETTINGS_KEY, newConfig)

        if (!success) {
            return false
        }

        // 计算变化的字段
        const changes = diffConfig(oldConfig, newConfig)

        if (changes.length === 0) {
            return true
        }

        // 收集需要执行的回调（去重）
        const callbacksToExecute = new Set()
        const callbackChanges = new Map() // Map<callback, changes[]>

        changes.forEach(change => {
            const callbacks = keyToCallbacks.get(change.key)
            if (callbacks) {
                callbacks.forEach(callback => {
                    callbacksToExecute.add(callback)

                    // 收集该回调对应的所有变更
                    if (!callbackChanges.has(callback)) {
                        callbackChanges.set(callback, [])
                    }
                    callbackChanges.get(callback).push(change)
                })
            }
        })

        // 执行回调（支持异步）
        const promises = []
        callbacksToExecute.forEach(callback => {
            const changesForCallback = callbackChanges.get(callback)
            try {
                const result = callback(changesForCallback)
                if (result instanceof Promise) {
                    promises.push(result)
                }
            } catch (error) {
                console.error('[SettingsManager] Callback error:', error)
            }
        })

        // 等待所有异步回调完成
        if (promises.length > 0) {
            await Promise.allSettled(promises)
        }

        return true
    }

    return {
        getConfig,
        on,
        off,
        save
    }
}

/**
 * 获取配置管理器实例（单例）
 * @returns {ReturnType<typeof createSettingsManager>}
 */
export function useSettingsManager() {
    if (!instance) {
        instance = createSettingsManager()
    }
    return instance
}

