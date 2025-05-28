import { getCache, removeCache, setCache } from './local-cache'
import { watch, isRef } from 'vue'

// 管理 FormStorage 实例的事件
class FormStorageManager {
    // 实例数组，比如当前页面并不止一个表单，或者多开页面填写多个表单
    static instances = []
    static isInitialized = false

    static register(instance) {
        // 如果初始化过，则不再注册
        if (FormStorageManager.isInitialized) return

        FormStorageManager.instances.push(instance)

        // 卸载前
        window.addEventListener('beforeunload', FormStorageManager.saveAll)
        // 页面可见度监听
        document.addEventListener('visibilitychange', FormStorageManager.handleVisibilityChange)

        FormStorageManager.isInitialized = true
    }

    static saveAll() {
        // saveData 这个方法存储不需要延迟，立即存储
        FormStorageManager.instances.forEach(instance => instance.saveData())
    }

    static handleVisibilityChange() {
        // 当前页面进入隐藏的时候保存数据
        if (document.visibilityState === 'hidden') {
            FormStorageManager.saveAll()
        }
    }
}

export class FormStorage {
    /**
     *
     * @param {String} formId
     * @param {import('vue').Ref} formData
     */
    constructor(formId, formData) {
        this.formId = formId // 存储id
        this.formData = formData // 存储当前这个实例的表单的数据
        this.storageKey = `form_data_${formId}` // 生成一个唯一的key

        this.debouncedSaveData = this.debounce(this.saveData, 1000).bind(this)
        this.closeWatch = this.openWatch(this)
        this.channel = new BroadcastChannel('form sync')

        // 监听消息
        this.channel.onmessage = event => {
            const { formId, data } = JSON.parse(event.data)
            if (formId === this.formId) {
                // 表示打开了多个标签页，都是一个表单的时候需要同步数据
                this.syncData(data)
            }
        }

        // 注册实例
        FormStorageManager.register(this)
    }

    init() {
        this.loadData()
    }

    openWatch() {
        if (isRef(this.formData)) {
            return watch(this.formData.value, this.debouncedSaveData)
        }
        return () => {}
    }

    loadData() {
        // 加载时，提取本地存储的数据
        const data = getCache(this.storageKey)
        if (!data) return

        // 遍历取到的数据，赋值给当前表单
        for (const key in data) {
            // 如果当前表单有这个 key，则赋值
            if (Object.prototype.hasOwnProperty.call(this.formData.value, key)) {
                this.formData.value[key] = data[key]
            }
        }
    }

    clearData() {
        removeCache(this.storageKey)
        this.closeWatch()
    }

    syncData(data) {
        if (!data) return
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(this.formData.value, key)) {
                this.formData.value[key] = data[key]
            }
        }
    }

    saveData() {
        setCache(this.storageKey, this.formData.value)
        this.channel.postMessage(JSON.stringify({ formId: this.formId, data: this.formData.value }))
    }

    debounce(func, wait) {
        let timeout
        return function (...args) {
            clearTimeout(timeout)
            timeout = setTimeout(() => func.apply(this, args), wait)
        }
    }
}
