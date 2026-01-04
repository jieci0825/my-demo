import { computed, ref, watch } from 'vue'
import { createEventHook, useDocumentVisibility } from '@vueuse/core'

/**
 * 子输入框 hook，提供子输入框的注册、取消、值监听等功能
 */
export const useSubInput = (
    placeholder = '输入关键词 #tag @category',
    isFocus = true
) => {
    const subInput = ref('')

    const onChangedHook = createEventHook()
    const onSearchHook = createEventHook()
    const onClearHook = createEventHook()

    function handleKeyDown(e) {
        if (e.key === 'Enter' && subInput.value) {
            onSearchHook.trigger(subInput.value)
            e.preventDefault()
            e.stopPropagation()
        }
    }

    function doRegister(value = '') {
        utools.removeSubInput()
        utools.setSubInput(
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
        if (value) {
            utools.setSubInputValue(value)
            subInput.value = value
            onChangedHook.trigger(value)
        }
        window.addEventListener('keydown', handleKeyDown)
    }

    function register(initialValue = '') {
        subInput.value = initialValue
        doRegister(initialValue)
    }

    function unregister() {
        utools.removeSubInput()
        window.removeEventListener('keydown', handleKeyDown)
    }

    function setSubInput(val) {
        subInput.value = val
        utools.setSubInputValue(val)
        onChangedHook.trigger(val)
    }

    const documentVisibility = useDocumentVisibility()

    watch(documentVisibility, v => {
        if (v === 'hidden') {
            utools.removeSubInput()
            window.removeEventListener('keydown', handleKeyDown)
        } else {
            doRegister(subInput.value)
        }
    })

    return {
        value: computed(() => subInput.value),
        register,
        unregister,
        setSubInput,
        onChanged: onChangedHook.on,
        onSearch: onSearchHook.on,
        onClear: onClearHook.on
    }
}
