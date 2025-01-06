<script setup lang="ts">
import { useEditorStore } from '@/stores/use-editor'
import { emitter } from '@/utils'
import { nextTick, ref } from 'vue'
import { Close } from '@element-plus/icons-vue'

const centerContainerRef = ref<HTMLElement | null>(null)
const editorStore = useEditorStore()

const scrollToBottom = () => {
    if (!centerContainerRef.value) return
    nextTick(() => {
        const container = centerContainerRef.value!
        container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
        })
    })
}
emitter.on('scrollToBottom', scrollToBottom)

const handleClick = (idx: number) => {
    if (editorStore.currentCompIndex === idx) {
        idx = -1
    }
    editorStore.setCurrentCompIndex(idx)
}

const handleRemove = (idx: number) => {
    console.log('handleRemove', idx)
}
</script>

<template>
    <div
        ref="centerContainerRef"
        class="center-container hide-scrollbar ml-20 mr-20 p-20"
    >
        <div
            v-for="(item, idx) in editorStore.comps"
            class="content p-10 relative"
            :class="{ active: editorStore.currentCompIndex === idx }"
            :key="item.id"
            @click="handleClick(idx)"
        >
            <Component
                :editCompConfig="item.editCompConfig"
                :sn="1"
                :is="item.type"
            />
            <!-- close -->
            <el-button
                v-if="editorStore.currentCompIndex === idx"
                class="absolute close-btn"
                type="danger"
                size="small"
                circle
                :icon="Close"
                @click.stop="handleRemove(idx)"
            >
            </el-button>
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
    gap: 15px;
    .content {
        cursor: pointer;
        border-radius: var(--border-radius-large);
        overflow: hidden;
        border: 1px solid transparent;
        &:hover {
            transform: scale(1.01);
            transition: 0.5s;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        &.active {
            transition: 0.3s;
            border: 1px solid var(--border-color);
            .close-btn {
                display: block;
            }
        }
        .close-btn {
            top: 10px;
            right: 10px;
            display: none;
        }
    }
}
</style>
