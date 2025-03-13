<script setup lang="ts">
import { defaultStatusMap } from '@/configs/default-status/default-status-map'
import { updateInitStatusBeforeAdd } from '@/utils'
import { useEditorStore } from '@/stores/use-editor'
import type { MaterialKeys } from '@/types'

interface Props {
    materialName: MaterialKeys
    comName: string
}

const props = defineProps<Props>()
const editorStore = useEditorStore()

const addSurveyComp = () => {
    const status = defaultStatusMap[props.materialName]()
    // 初始化状态
    updateInitStatusBeforeAdd(status, props.materialName)
    editorStore.addComp(status)
}
</script>

<template>
    <div
        class="survey-comp-item"
        @click="addSurveyComp"
    >
        <span>{{ props.comName }}</span>
    </div>
</template>

<style scoped lang="scss">
.survey-comp-item {
    width: calc(100% / 2 - 10px);
    height: 32px;
    line-height: 32px;
    user-select: none;
    text-decoration: none;
    background-color: var(--background-color);
    color: var(--font-color-light);
    text-align: center;
    border-radius: var(--border-radius-base);
    font-size: var(--font-size-base);
    transition: all 0.25s ease-in;
    &:hover {
        background-color: var(--info-color);
        color: var(--white);
    }
    &-active {
        background-color: var(--info-color);
        color: var(--white);
    }
}
</style>
