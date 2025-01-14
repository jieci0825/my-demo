<script setup lang="ts">
const {
    title = '这是一个标题',
    desc = '这是一个描述',
    sn
} = defineProps<{
    sn: number | null
    title: string
    desc: string
    titleSize: string
    descSize: string
    isTitleBold: boolean
    isDescBold: boolean
    isTitleSlant: boolean
    isDescSlant: boolean
    titleColor: string
    descColor: string
}>()

const formatSn = (sn: number) => {
    return sn < 10 ? `0${sn}` : sn
}
</script>

<template>
    <div class="materials-header mb-15">
        <h2
            :style="{ fontSize: `${titleSize}px`, color: `${titleColor}` }"
            :class="['title', !isTitleBold ? 'font-bold' : 'font-weight-100', !isTitleSlant ? 'font-italic' : '']"
        >
            <span
                v-if="sn"
                class="mr-10 font-weight-500"
                >{{ formatSn(sn) }}.</span
            >
            <span>{{ title }}</span>
        </h2>
        <div
            v-if="desc"
            :style="{ fontSize: `${descSize}px`, color: `${descColor}` }"
            :class="['description', 'mt-8', !isDescBold ? 'font-bold' : '', !isDescSlant ? 'font-italic' : '']"
        >
            {{ desc }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.materials-header {
    h2 {
        font-size: 20px;
        color: var(--font-color);
    }
    .description {
        font-size: var(--font-size-base);
        color: var(--font-color-lightest);
        text-indent: 5px;
    }
}
</style>
