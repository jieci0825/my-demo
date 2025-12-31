<script setup>
import { watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: ''
    },
    width: {
        type: String,
        default: '50%'
    },
    height: {
        type: String,
        default: '80%'
    },
    fullscreen: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:visible'])

const handleClose = () => {
    emit('update:visible', false)
}

const handleMaskClick = () => {
    handleClose()
}

const handleDialogClick = e => {
    // 阻止事件冒泡，防止点击弹窗内容时关闭
    e.stopPropagation()
}

const handleKeydown = e => {
    if (e.key === 'Escape' && props.visible) {
        handleClose()
    }
}

// 监听 visible 变化，控制 body 滚动
watch(
    () => props.visible,
    newVal => {
        if (newVal) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
    }
)

// 添加 ESC 键监听
onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
    // 组件卸载时恢复滚动
    document.body.style.overflow = ''
})
</script>

<template>
    <Teleport to="body">
        <Transition name="dialog-fade">
            <div
                v-if="visible"
                class="c-dialog-mask"
                @click="handleMaskClick"
            >
                <Transition name="dialog-content">
                    <div
                        v-if="visible"
                        class="c-dialog"
                        :class="{ 'is-fullscreen': fullscreen }"
                        :style="{
                            width: fullscreen ? '100%' : width,
                            height: fullscreen ? '100%' : height
                        }"
                        @click="handleDialogClick"
                    >
                        <!-- 头部 -->
                        <div class="c-dialog__header">
                            <div class="c-dialog__title">{{ title }}</div>
                            <button
                                class="c-dialog__close"
                                @click="handleClose"
                            >
                                <svg
                                    viewBox="0 0 1024 1024"
                                    width="16"
                                    height="16"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                                    />
                                </svg>
                            </button>
                        </div>

                        <!-- 内容 -->
                        <div class="c-dialog__body">
                            <slot></slot>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped lang="scss">
.c-dialog-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.c-dialog {
    background: var(--color-bg);
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    &.is-fullscreen {
        border-radius: 0;
    }

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid var(--color-border);
    }

    &__title {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-text-title);
    }

    &__close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border: none;
        border-radius: 4px;
        background: transparent;
        color: var(--color-text-tip);
        cursor: pointer;
        transition: all 0.3s ease;
        outline: none;

        &:hover {
            background: var(--color-bg-hover);
            color: var(--color-text-body);
        }

        &:active {
            opacity: 0.8;
        }
    }

    &__body {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        color: var(--color-text-body);
    }
}

// 遮罩层淡入淡出动画
.dialog-fade-enter-active,
.dialog-fade-leave-active {
    transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
    opacity: 0;
}

// 弹窗内容缩放动画
.dialog-content-enter-active,
.dialog-content-leave-active {
    transition: all 0.3s ease;
}

.dialog-content-enter-from {
    opacity: 0;
    transform: scale(0.9);
}

.dialog-content-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
