<script setup lang="ts">
import PageHeader from '@/components/common/page-header/index.vue'
import LeftSide from './left-side/index.vue'
import RightSide from './right-side/index.vue'
import CenterContainer from './center/index.vue'
import { EditorMode, EditorModeTextMap, GET_PIC_LINK, UPDATE_STATE } from '@/constants'
import { useRoute } from 'vue-router'
import { useEditorStore } from '@/stores/use-editor'
import { computed, provide, type ComputedRef } from 'vue'
import { dispatchStatus } from '@/stores/common-dispatch'
import type { FullEditCompStatus, PicLink } from '@/types'

const $route = useRoute()
const mode = $route.params.mode as EditorMode

const editorStore = useEditorStore()

const editCompConfig = computed(() => {
    return editorStore.comps[editorStore.currentCompIndex]?.editCompConfig
})

const updateState = dispatchStatus(editorStore, editCompConfig as ComputedRef<FullEditCompStatus>)

const getPicLink = (payload: PicLink) => {
    updateState('options', payload)
}

provide(UPDATE_STATE, updateState)
provide(GET_PIC_LINK, getPicLink)
</script>

<template>
    <div class="editor-container">
        <PageHeader :title="EditorModeTextMap[mode]"></PageHeader>
        <div class="main flex">
            <LeftSide></LeftSide>
            <CenterContainer></CenterContainer>
            <RightSide></RightSide>
        </div>
    </div>
</template>

<style scoped lang="scss">
.editor-container {
    width: 100%;
    height: 100%;
    .main {
        margin: 0 auto;
        padding: 20px;
        height: calc(100vh - 60px);
    }
}
</style>
