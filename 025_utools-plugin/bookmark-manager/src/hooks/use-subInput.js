import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { createEventHook, useDocumentVisibility } from '@vueuse/core'

/**
 * 子输入框hook
 * @param [initialValue] {string} 子输入框初始值
 * @param [placeholder] {string} 占位符
 * @param [isFocus] {boolean} 是否聚焦，默认true
 */
export const useSubInput = (
    initialValue = '',
    placeholder = '输入关键词 #tag @category',
    isFocus = true
) => {
    // 是否在注册中
    let registering = false
    // 子输入框是否已注册
    let isRegistered = false
    // 待设置的值（在子输入框注册前暂存）
    let pendingValue = null

    // 子输入框的值
    const subInput = ref(initialValue)
    // 子输入的包装值
    const subInputWrap = computed(() => subInput.value)

    // 当数据变化的hook
    const onChangedHook = createEventHook()
    // 当搜索时的hook
    const onSearchHook = createEventHook()
    // 当搜索时的hook
    const onClearHook = createEventHook()

    // 键盘按下的事件监听
    function handleKeyDown(e) {
        if (e.key === 'Enter' && subInput.value) {
            onSearchHook.trigger(subInput.value)
            e.preventDefault()
            e.stopPropagation()
        }
    }

    function register() {
        if (registering) {
            return
        }
        registering = true
        isRegistered = false
        // 先移除之前的
        utools.removeSubInput()

        // 不停尝试注册子输入框，直至注册成功
        const interval = setInterval(() => {
            let res = utools.setSubInput(
                ({ text }) => {
                    if (subInput.value !== text) {
                        subInput.value = text
                        onChangedHook.trigger(text)
                        if (!text) {
                            onClearHook.trigger()
                        }
                    }
                },
                placeholder,
                isFocus
            )
            // 如果注册成功
            if (res) {
                isRegistered = true
                // 设置初始值（优先使用待设置的值）
                const valueToSet = pendingValue !== null ? pendingValue : initialValue
                if (valueToSet) {
                    subInput.value = valueToSet
                    utools.setSubInputValue(valueToSet)
                    onChangedHook.trigger(valueToSet)
                }
                pendingValue = null
                // 清除定时器
                clearInterval(interval)
                registering = false
            }
        }, 100)
    }

    onMounted(() => {
        register()
        window.addEventListener('keydown', handleKeyDown)
    })

    onUnmounted(() => {
        utools.removeSubInput()
        window.removeEventListener('keydown', handleKeyDown)
    })

    function setSubInput(val) {
        // 如果子输入框还未注册，暂存值等待注册后设置
        if (!isRegistered) {
            pendingValue = val
            return
        }
        subInput.value = val
        utools.setSubInputValue(subInput.value)
        onChangedHook.trigger(val)
    }

    // 文档可见性
    //  - 当前页面是在前台，还是被切到后台 / 最小化 / 切换标签页
    const documentVisibility = useDocumentVisibility()

    watch(documentVisibility, isVisible => {
        if (isVisible === 'hidden') {
            utools.removeSubInput()
            window.removeEventListener('keydown', handleKeyDown)
        } else {
            register()
            window.addEventListener('keydown', handleKeyDown)
        }
    })

    return {
        value: subInputWrap,
        setSubInput,
        register,
        onChanged: onChangedHook.on,
        onSearch: onSearchHook.on,
        onClear: onClearHook.on
    }
}
