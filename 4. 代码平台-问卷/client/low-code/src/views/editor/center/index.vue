<script setup lang="ts">
import Draggable from 'vuedraggable'
import { useEditorStore } from '@/stores/use-editor'
import { emitter, getRenderSnList } from '@/utils'
import { computed, nextTick, ref } from 'vue'
import { Close } from '@element-plus/icons-vue'

const centerContainerRef = ref<HTMLElement | null>(null)
const editorStore = useEditorStore()

const snList = computed(() => getRenderSnList(editorStore.comps).value)

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

// 滚动到指定的组件位置
const scrollToComp = (idx: number) => {
    if (!centerContainerRef.value) return
    nextTick(() => {
        const container = centerContainerRef.value!
        // draggable组件内部会自动添加一个div包裹，所以实际要获取的是这个div下面的子元素
        const comp = container.querySelector('div')!.children[idx] as HTMLElement
        if (comp) {
            container.scrollTo({
                top: comp.offsetTop,
                behavior: 'smooth'
            })
        }
    })
}
emitter.on('scrollToComp', scrollToComp)

const handleClick = (idx: number) => {
    if (editorStore.currentCompIndex === idx) {
        idx = -1
    }
    editorStore.setCurrentCompIndex(idx)
}

const handleRemove = (idx: number) => {
    console.log('handleRemove', idx)
}

const dragStart = () => {
    // 拖拽开始时，将选中的组件索引重置为-1，恢复不选中状态
    editorStore.setCurrentCompIndex(-1)
}
</script>

<template>
    <div
        ref="centerContainerRef"
        class="center-container hide-scrollbar ml-20 mr-20 p-20"
    >
        <template v-if="!editorStore.comps.length">
            <el-empty description="暂无内容" />
        </template>
        <template v-else>
            <Draggable
                v-model="editorStore.comps"
                item-key="index"
                @start="dragStart"
            >
                <template #item="{ element: item, index: idx }">
                    <div
                        class="content p-10 relative"
                        :class="{ active: editorStore.currentCompIndex === idx }"
                        :key="item.id"
                        @click="handleClick(idx)"
                    >
                        <Component
                            :editCompConfig="item.editCompConfig"
                            :sn="snList[idx]"
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
                </template>
            </Draggable>
        </template>
    </div>
</template>

<style scoped lang="scss">
.center-container {
    flex: 1;
    height: 100%;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-base);
    overflow-y: auto;
    .content {
        cursor: pointer;
        border-radius: var(--border-radius-large);
        border: 1px solid transparent;
        margin-top: 15px;
        &:nth-child(1) {
            margin-top: 0;
        }
        &:hover {
            transform: scale(1.01);
            transition: 0.5s;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            &.active {
                border: 1px solid var(--border-color);
                .close-btn {
                    transform: scale(1);
                    transition: 0.3s;
                    opacity: 1;
                }
            }
        }

        .close-btn {
            top: 10px;
            right: 10px;
            opacity: 0;
            transform: scale(0);
        }
    }
}
</style>
