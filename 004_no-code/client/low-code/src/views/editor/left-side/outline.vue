<script setup lang="ts">
import Draggable from 'vuedraggable'
import { useEditorStore } from '@/stores/use-editor'
import { emitter, getRenderSnList, isQuestionType } from '@/utils'
import { computed } from 'vue'

const editorStore = useEditorStore()

const snList = computed(() => getRenderSnList(editorStore.comps).value)

const handleClick = (idx: number) => {
    if (editorStore.currentCompIndex === idx) {
        editorStore.setCurrentCompIndex(-1)
    } else {
        editorStore.setCurrentCompIndex(idx)
        // 点击大纲时，滚动到对应组件
        emitter.emit('scrollToComp', idx)
    }
}

const dragStart = () => {
    // 拖拽开始时，将选中的组件索引重置为-1，恢复不选中状态
    editorStore.setCurrentCompIndex(-1)
}
</script>

<template>
    <div class="outline-container p-15">
        <div v-if="editorStore.surveyCount">
            <h2 class="outline-title font-weight-500 mb-15">问卷大纲</h2>
            <draggable
                v-model="editorStore.comps"
                item-key="index"
                class="outline-list"
                @start="dragStart"
            >
                <!-- 非题目类型的标题不进行渲染，序号为 null 则表示不是一个题目类型 -->
                <!-- tips: 不能将注释加入此插槽内部，也会被认为是多个子节点，仅允许单个子节点 -->
                <template #item="{ element, index }">
                    <div
                        v-if="isQuestionType(element.editCompConfig.type)"
                        class="outline-item"
                        @click="handleClick(index)"
                    >
                        {{ snList[index] }}. {{ element.editCompConfig.title.state }}
                    </div>
                </template>
            </draggable>
        </div>
        <div v-else>
            <el-empty description="暂无内容" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.outline-container {
    overflow: hidden auto;
    position: relative;
    .outline-title {
        position: sticky;
        top: 0;
        background-color: inherit;
    }
    .outline-list {
        .outline-item {
            overflow: hidden;
            margin-top: 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            color: var(--font-color-light);
            transition: all 0.3s ease-in-out;
            &:nth-child(1) {
                margin-top: 0;
            }
            &:hover {
                color: var(--primary-color);
            }
        }
    }
}
</style>
