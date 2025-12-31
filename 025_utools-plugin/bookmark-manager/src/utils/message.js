import { createApp, reactive } from 'vue'
import CMessage from '../components/c-message/index.vue'

// 消息实例列表，按位置分组
const instances = reactive({
    top: [],
    'top-left': [],
    'top-right': [],
    bottom: [],
    'bottom-left': [],
    'bottom-right': []
})
let seed = 1

// 默认配置
const defaultOptions = {
    message: '',
    type: 'info',
    duration: 3000,
    showClose: false,
    center: false,
    offset: 20,
    zIndex: 2000
}

// 创建消息实例
function createMessage(options) {
    const id = `message_${seed++}`
    const userOnClose = options.onClose

    // 合并配置
    const props = {
        ...defaultOptions,
        ...options,
        id
    }

    const placement = props.placement

    // 确保 placement 是有效的
    if (!instances[placement]) {
        instances[placement] = []
    }

    const placementInstances = instances[placement]

    // 计算 z-index
    props.zIndex = defaultOptions.zIndex + placementInstances.length

    // 计算偏移量
    let offset = props.offset
    placementInstances.forEach((instance, index) => {
        offset += 60 // 60 是消息高度加上间距
    })
    props.offset = offset

    // 创建容器
    const container = document.createElement('div')
    container.className = `c-message-container c-message-container--${props.type}`

    // 创建应用实例
    const app = createApp(CMessage, {
        ...props,
        onClose: () => {
            closeMessage(id)
            if (userOnClose) {
                userOnClose()
            }
        },
        onDestroy: () => {
            removeMessage(id)
        }
    })

    // 挂载应用
    const vm = app.mount(container)
    document.body.appendChild(container)

    // 添加到实例列表
    const instance = {
        id,
        app,
        vm,
        container,
        props,
        placement
    }

    placementInstances.push(instance)

    return instance
}

// 关闭消息
function closeMessage(id) {
    for (const placement in instances) {
        const placementInstances = instances[placement]
        const index = placementInstances.findIndex(instance => instance.id === id)
        if (index > -1) {
            const instance = placementInstances[index]
            instance.vm.close()
            break
        }
    }
}

// 移除消息
function removeMessage(id) {
    for (const placement in instances) {
        const placementInstances = instances[placement]
        const index = placementInstances.findIndex(instance => instance.id === id)
        if (index > -1) {
            const instance = placementInstances.splice(index, 1)[0]

            // 重新计算后续消息的位置
            let offset = defaultOptions.offset
            placementInstances.forEach((inst, idx) => {
                if (idx >= index) {
                    offset += 60 // 60 是消息高度加上间距
                    inst.vm.component.props.offset = offset
                }
            })

            // 销毁实例
            setTimeout(() => {
                instance.app.unmount()
                document.body.removeChild(instance.container)
            }, 300) // 等待动画完成
            break
        }
    }
}

// 关闭所有消息
function closeAll() {
    for (const placement in instances) {
        instances[placement].forEach(instance => {
            instance.vm.close()
        })
    }
}

// 主函数
function message(options) {
    if (typeof options === 'string') {
        options = { message: options }
    }
    return createMessage(options)
}

// 不同类型的快捷方法
message.success = (message, options = {}) => {
    return createMessage({
        ...options,
        message,
        type: 'success'
    })
}

message.warning = (message, options = {}) => {
    return createMessage({
        ...options,
        message,
        type: 'warning'
    })
}

message.info = (message, options = {}) => {
    return createMessage({
        ...options,
        message,
        type: 'info'
    })
}

message.error = (message, options = {}) => {
    return createMessage({
        ...options,
        message,
        type: 'error'
    })
}

message.closeAll = closeAll

// 配置方法
message.config = (options) => {
    if (options) {
        Object.assign(defaultOptions, options)
    }
    return { ...defaultOptions }
}

export default message
