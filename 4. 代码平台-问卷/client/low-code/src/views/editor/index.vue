<script setup lang="ts">
import PageHeader from '@/components/common/page-header/index.vue'
import LeftSide from './left-side/index.vue'
import RightSide from './right-side/index.vue'
import CenterContainer from './center/index.vue'
import { EditorMode, EditorModeTextMap } from '@/constants'
import { useRoute } from 'vue-router'

const $route = useRoute()
const mode = $route.params.mode as EditorMode
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
