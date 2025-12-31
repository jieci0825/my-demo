<script setup>
import { ref } from 'vue'
import { Plus, Setting, PriceTag } from '@element-plus/icons-vue'
import CButton from '@/components/c-button/index.vue'

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['tag-click', 'setting-click'])

const isMenuVisible = ref(false)

const handleTagClick = () => {
    emit('tag-click')
}

const handleSettingClick = () => {
    emit('setting-click')
}
</script>

<template>
    <transition name="button-fade">
        <div
            v-show="visible"
            class="floating-button-group"
            @mouseenter="isMenuVisible = true"
            @mouseleave="isMenuVisible = false"
        >
            <!-- 菜单项 -->
            <transition name="menu">
                <div
                    v-show="isMenuVisible"
                    class="menu-items"
                >
                    <CButton
                        type="primary"
                        size="small"
                        circle
                        @click="handleTagClick"
                        title="标签"
                    >
                        <component
                            :is="PriceTag"
                            class="icon"
                        />
                    </CButton>
                    <CButton
                        type="primary"
                        size="small"
                        circle
                        @click="handleSettingClick"
                        title="设置"
                    >
                        <component
                            :is="Setting"
                            class="icon"
                        />
                    </CButton>
                </div>
            </transition>

            <!-- 主按钮 -->
            <CButton
                type="primary"
                size="small"
                circle
                class="main-button"
            >
                <component
                    :is="Plus"
                    class="icon"
                />
            </CButton>
        </div>
    </transition>
</template>

<style scoped lang="scss">
.floating-button-group {
    position: fixed;
    bottom: 20px;
    right: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 2000;

    .icon {
        width: 16px;
        height: 16px;
    }

    .menu-items {
        display: flex;
        flex-direction: column;
        gap: 12px;

        :deep(.c-button) {
            transition: all 0.3s ease;

            &:hover {
                transform: scale(1.1);
            }
        }
    }

    .main-button {
        transition: transform 0.3s ease;

        &:hover {
            transform: rotate(135deg);
        }
    }
}

// 按钮组显示/隐藏动画
.button-fade-enter-active,
.button-fade-leave-active {
    transition: all 0.3s ease;
}

.button-fade-enter-from,
.button-fade-leave-to {
    opacity: 0;
    transform: translateX(20px);
}

.button-fade-enter-to,
.button-fade-leave-from {
    opacity: 1;
    transform: translateX(0);
}

// 菜单项展开动画
.menu-enter-active,
.menu-leave-active {
    transition: all 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

.menu-enter-to,
.menu-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>
