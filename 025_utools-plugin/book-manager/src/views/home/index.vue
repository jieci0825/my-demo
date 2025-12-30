<script setup>
import { ref } from 'vue'
import { useElementHover } from '@vueuse/core'
import VirtualList from './components/virtual-list.vue'
import FloatingMenu from './components/floating-menu.vue'

const containerRef = ref(null)
const isHovered = useElementHover(containerRef)
</script>

<template>
    <div
        ref="containerRef"
        class="container"
    >
        <VirtualList />
        <FloatingMenu :visible="isHovered" />
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: relative;
}
</style>
