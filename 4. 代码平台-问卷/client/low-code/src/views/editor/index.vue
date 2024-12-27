<script setup lang="ts">
import PageHeader from '@/components/common/page-header/index.vue'
import { EditorMode, EditorModeTextMap } from '@/constants';
import { useRoute } from 'vue-router';

const $route = useRoute();
const mode = $route.params.mode as EditorMode;
</script>

<template>
    <div class="editor-container">
        <PageHeader :title="EditorModeTextMap[mode]"</PageHeader>
    </div>
</template>

<style scoped lang="scss">
.editor-container {
    width: 100%;
}
</style>
