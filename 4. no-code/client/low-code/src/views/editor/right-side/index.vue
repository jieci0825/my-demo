<script setup lang="ts">
import EditPanel from '@/components/survey-comps/edit-items/edit-panel.vue'
import { useEditorStore } from '@/stores/use-editor'
import { computed } from 'vue'

const editorStore = useEditorStore()

const comps = computed(() => {
    return editorStore.comps[editorStore.currentCompIndex]
})
</script>

<template>
    <div class="right-side-container">
        <!-- tips -->
        <template v-if="editorStore.currentCompIndex === -1">
            <div class="tips mt-20">点击题型进行编辑</div>
        </template>
        <!-- show -->
        <template v-else>
            <EditPanel :comp="comps"></EditPanel>
        </template>
    </div>
</template>

<style scoped lang="scss">
.right-side-container {
    width: 320px;
    height: 100%;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-base);
    .tips {
        color: var(--font-color-lightest);
        font-size: 20px;
        text-align: center;
    }
}
</style>
