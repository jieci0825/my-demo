<script setup>
import { ref } from 'vue'
import { useElementHover } from '@vueuse/core'
import VirtualList from './components/virtual-list.vue'
import FloatingMenu from './components/floating-menu.vue'
import CDialog from '@/components/c-dialog/index.vue'
import TagManager from './components/tag-manager.vue'
import Settings from './components/settings.vue'

const containerRef = ref(null)
const virtualListRef = ref(null)
const isHovered = useElementHover(containerRef)

// 标签弹窗显示状态
const tagDialogVisible = ref(false)
// 设置弹窗显示状态
const settingDialogVisible = ref(false)

const handleTagClick = () => {
    tagDialogVisible.value = true
}

const handleSettingClick = () => {
    settingDialogVisible.value = true
}

const handleSettingsSaved = () => {
    virtualListRef.value?.refreshSettings()
}
</script>

<template>
    <div
        ref="containerRef"
        class="container"
    >
        <VirtualList ref="virtualListRef" />
        <FloatingMenu
            :visible="isHovered"
            @tag-click="handleTagClick"
            @setting-click="handleSettingClick"
        />

        <!-- 标签管理弹窗 -->
        <CDialog
            v-model:visible="tagDialogVisible"
            title="标签管理"
            :fullscreen="true"
        >
            <TagManager />
        </CDialog>

        <!-- 设置弹窗 -->
        <CDialog
            v-model:visible="settingDialogVisible"
            title="设置"
            :fullscreen="true"
        >
            <Settings
                @close="settingDialogVisible = false"
                @saved="handleSettingsSaved"
            />
        </CDialog>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background: var(--color-bg);
}
</style>
