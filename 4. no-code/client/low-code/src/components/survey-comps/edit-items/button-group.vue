<script setup lang="ts">
interface Props {
    label: string
    text: string
}
const props = defineProps<Props>()
</script>

<template>
    <div class="button-group flex align-items-center">
        <div class="label font-weight-600">{{ props.label }}</div>
        <div class="text ml-10">{{ text }}</div>
        <div class="choose">
            <slot> </slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.button-group {
    .label {
        color: var(--font-color-light);
    }
    .text {
        font-size: 14px;
        color: var(--font-color-lighter);
    }
    .choose {
        margin-left: auto;
    }
}
</style>
