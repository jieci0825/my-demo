<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
    message: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'info' // success | warning | info | error
    },
    duration: {
        type: Number,
        default: 3000
    },
    showClose: {
        type: Boolean,
        default: false
    },
    center: {
        type: Boolean,
        default: false
    },
    offset: {
        type: Number,
        default: 20
    },
    zIndex: {
        type: Number,
        default: 2000
    },
    placement: {
        type: String,
        default: 'top' // top | top-left | top-right | bottom | bottom-left | bottom-right
    }
})

const emit = defineEmits(['close', 'destroy'])

const visible = ref(false)
const timer = ref(null)

// 关闭消息
const handleClose = () => {
    visible.value = false
}

// 暴露给父组件的方法
defineExpose({
    close: handleClose
})

const messageClass = computed(() => {
    return [
        'c-message',
        `c-message--${props.type}`,
        {
            'is-center': props.center
        }
    ]
})

const messageStyle = computed(() => {
    const style = {
        zIndex: props.zIndex
    }

    switch (props.placement) {
        case 'top':
            style.top = `${props.offset}px`
            style.left = '50%'
            style.transform = 'translateX(-50%)'
            break
        case 'top-left':
            style.top = `${props.offset}px`
            style.left = '20px'
            break
        case 'top-right':
            style.top = `${props.offset}px`
            style.right = '20px'
            break
        case 'bottom':
            style.bottom = `${props.offset}px`
            style.left = '50%'
            style.transform = 'translateX(-50%)'
            break
        case 'bottom-left':
            style.bottom = `${props.offset}px`
            style.left = '20px'
            break
        case 'bottom-right':
            style.bottom = `${props.offset}px`
            style.right = '20px'
            break
        default:
            style.top = `${props.offset}px`
            style.left = '50%'
            style.transform = 'translateX(-50%)'
    }

    return style
})

// 类型对应的图标
const iconMap = {
    success:
        'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z',
    warning:
        'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z',
    info: 'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z',
    error: 'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-210.6-292a31.8 31.8 0 0 0-51.7 0L318.5 484.9c-3.8 5.3 0 12.7 6.5 12.7h46.9c10.2 0 19.9-4.9 25.9-13.3l71.2-98.8 157.2 218c6 8.3 15.6 13.3 25.9 13.3H699c6.5 0 10.3-7.4 6.5-12.7z'
}

const clearTimer = () => {
    if (timer.value) {
        clearTimeout(timer.value)
        timer.value = null
    }
}

const startTimer = () => {
    if (props.duration > 0) {
        timer.value = setTimeout(() => {
            handleClose()
        }, props.duration)
    }
}

const resetTimer = () => {
    clearTimer()
    startTimer()
}

// 监听 visible 变化
watch(
    () => visible.value,
    (newVal, oldVal) => {
        if (newVal && !oldVal) {
            // 显示时启动定时器
            startTimer()
        } else if (!newVal && oldVal) {
            // 隐藏时清理定时器并销毁
            clearTimer()
            // 延迟销毁，让动画完成
            setTimeout(() => {
                emit('destroy')
            }, 300)
        }
    }
)

// 组件挂载时显示
onMounted(() => {
    visible.value = true
})

// 组件卸载时清理定时器
onUnmounted(() => {
    clearTimer()
})
</script>

<template>
    <Transition name="message-fade">
        <div
            v-if="visible"
            :class="messageClass"
            :style="messageStyle"
            @mouseenter="clearTimer"
            @mouseleave="resetTimer"
        >
            <div class="c-message__content">
                <div class="c-message__icon">
                    <svg
                        viewBox="0 0 1024 1024"
                        width="16"
                        height="16"
                    >
                        <path
                            fill="currentColor"
                            :d="iconMap[type]"
                        />
                    </svg>
                </div>
                <div class="c-message__text">{{ message }}</div>
                <button
                    v-if="showClose"
                    class="c-message__close"
                    @click="handleClose"
                >
                    <svg
                        viewBox="0 0 1024 1024"
                        width="12"
                        height="12"
                    >
                        <path
                            fill="currentColor"
                            d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.c-message {
    position: fixed;
    min-width: 300px;
    max-width: 600px;
    padding: 12px 16px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    pointer-events: all;
    z-index: 3000;

    &.is-center {
        justify-content: center;
    }

    // 不同类型样式
    &--success {
        border-color: #67c23a;
        background-color: #f0f9ff;
        color: #67c23a;

        .c-message__icon {
            color: #67c23a;
        }
    }

    &--warning {
        border-color: #e6a23c;
        background-color: #fdf6ec;
        color: #e6a23c;

        .c-message__icon {
            color: #e6a23c;
        }
    }

    &--info {
        border-color: #909399;
        background-color: var(--color-bg-sub);
        color: var(--color-text-body);

        .c-message__icon {
            color: #909399;
        }
    }

    &--error {
        border-color: #f56c6c;
        background-color: #fef0f0;
        color: #f56c6c;

        .c-message__icon {
            color: #f56c6c;
        }
    }

    &__content {
        display: flex;
        align-items: center;
        width: 100%;
    }

    &__icon {
        margin-right: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    &__text {
        flex: 1;
        font-size: 14px;
        line-height: 1.4;
    }

    &__close {
        margin-left: 8px;
        padding: 0;
        border: none;
        background: transparent;
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        justify-content: center;
        color: inherit;
        opacity: 0.7;
        transition: opacity 0.2s ease;

        &:hover {
            opacity: 1;
        }

        &:active {
            opacity: 0.8;
        }
    }
}

// 暗色主题适配
html.dark {
    .c-message {
        &--success {
            background-color: rgba(103, 194, 58, 0.1);
            border-color: #67c23a;
        }

        &--warning {
            background-color: rgba(230, 162, 60, 0.1);
            border-color: #e6a23c;
        }

        &--info {
            background-color: var(--color-bg-sub);
            border-color: var(--color-border);
        }

        &--error {
            background-color: rgba(245, 108, 108, 0.1);
            border-color: #f56c6c;
        }
    }
}

// 动画
.message-fade-enter-active,
.message-fade-leave-active {
    transition: all 0.3s ease;
}

.message-fade-enter-from {
    opacity: 0;
    &.c-message {
        &[style*='top'] {
            transform: translateY(-20px);
        }
        &[style*='bottom'] {
            transform: translateY(20px);
        }
        &[style*='left'] {
            transform: translateX(-20px);
        }
        &[style*='right'] {
            transform: translateX(20px);
        }
    }
}

.message-fade-leave-to {
    opacity: 0;
    &.c-message {
        &[style*='top'] {
            transform: translateY(-20px);
        }
        &[style*='bottom'] {
            transform: translateY(20px);
        }
        &[style*='left'] {
            transform: translateX(-20px);
        }
        &[style*='right'] {
            transform: translateX(20px);
        }
    }
}
</style>
