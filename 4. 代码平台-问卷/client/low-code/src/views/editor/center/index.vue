<script setup lang="ts">
import { useEditorStore } from '@/stores/use-editor'
import { emitter } from '@/utils'
import { nextTick, ref } from 'vue'

const centerContainerRef = ref<HTMLElement | null>(null)
const editorStore = useEditorStore()

const scrollToBottom = () => {
    if (!centerContainerRef.value) return
    nextTick(() => {
        const container = centerContainerRef.value!

        // 平滑的滚动到底部
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
        })
    })
}
emitter.on('scrollToBottom', scrollToBottom)
</script>

<template>
    <div
        ref="centerContainerRef"
        class="center-container hide-scrollbar ml-20 mr-20 p-20"
    >
        <div
            v-for="item in editorStore.comps"
            :key="item.id"
        >
            <Component
                :editCompConfig="item.editCompConfig"
                :sn="1"
                :is="item.type"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.center-container {
    flex: 1;
    height: 100%;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-base);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 30px;
}
</style>
