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
    //  - 使用 callback 作为 key，方便去重执行
    const callbackToKeys = new Map()

    // 反向索引：Map<key, Set<callback>>
    //  - 用于快速查找某个 key 对应的所有回调
    //  - 也方便后续如果需要在不指定keys的时候，取消某个 callback 的所有监听，就可以利用上
    const keyToCallbacks = new Map()

    /**
     * 获取当前配置
     */
    function getConfig() {
        const saved = dbTool.get(SETTINGS_KEY)
        return { ...DEFAULT_CONFIG, ...saved }
    }

    /**
     * 注册配置变更监听器
     */
    function on(keys, callback) {
        // 将 keys 进行参数归一化，方便后续处理
        const keyList = Array.isArray(keys) ? keys : [keys]

        // 检测 callback 是否已经注册过，如果没有注册过，则注册一个空的 Set
        if (!callbackToKeys.has(callback)) {
            callbackToKeys.set(callback, new Set())
        }

        // 获取 callback 对应的 keys
        const callbackKeys = callbackToKeys.get(callback)

        // 建立双向索引，将 callback 和 keys 建立关联
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
     * @description 这个字段返回的结构是：[{ key: string, oldValue: any, newValue: any }]
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
            // 根据 key 获取对应的 callback 集合
            const callbacks = keyToCallbacks.get(change.key)

            if (!callbacks) {
                return
            }

            callbacks.forEach(callback => {
                // 添加到需要执行的回调集合中
                callbacksToExecute.add(callback)

                // 收集该回调对应的所有变更
                //  - 将变更收集到 callbackChanges 中，方便后续执行回调时传入变更数据
                if (!callbackChanges.has(callback)) {
                    callbackChanges.set(callback, [])
                }
                callbackChanges.get(callback).push(change)
            })
        })

        // 执行回调（支持异步）
        const promises = []

        // 遍历需要执行的回调集合，执行回调
        callbacksToExecute.forEach(callback => {
            // 获取该回调对应的所有变更，也就是需要传入的参数
            const changesForCallbackParams = callbackChanges.get(callback)
            try {
                const result = callback(changesForCallbackParams)

                // 如果回调返回的是一个 Promise，则将 Promise 添加到 promises 集合中
                if (result instanceof Promise) {
                    promises.push(result)
                }
            } catch (error) {
                console.error('[SettingsManager] Callback error:', error)
            }
        })

        // 如果存在异步回调，则等待所有异步回调完成
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
 */
export function useSettingsManager() {
    if (!instance) {
        instance = createSettingsManager()
    }
    return instance
}
