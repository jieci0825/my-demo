<script setup>
import { ref } from 'vue'
import FlipClockItem from '@/components/FlipClockItem/index.vue'

import Example from '@/components/example/FlipClockItem.vue'

const compRef = ref(null)
const handleClick = () => {
    compRef.value.turnNext()
}
</script>

<template>
    <div class="container">
        <!-- <div>
            <button @click="handleClick">点击</button>
        </div>
        <Example ref="compRef" /> -->
        <FlipClockItem />
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e5d3b3;
}
</style>
