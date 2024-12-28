<script setup lang="ts">
const {
    title = '这是一个标题',
    desc = '这是一个描述',
    sn
} = defineProps<{
    sn: number
    title: string
    desc: string
}>()
</script>

<template>
    <div class="materials-header mb-15">
        <h2 class="title font-weight-100">
            <span class="mr-10">{{ sn }}.</span>
            <span>{{ title }}</span>
        </h2>
        <div class="description mt-3">{{ desc }}</div>
    </div>
</template>

<style scoped lang="scss">
.materials-header {
    h2 {
        font-size: 20px;
    }
    .description {
        font-size: var(--font-size-base);
        color: var(--font-color-light);
        text-indent: 5px;
    }
}
</style>
