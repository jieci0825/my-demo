<script setup lang="ts">
import { computed } from 'vue'
import type { TypeEditCompStatus } from '@/types'
import { useMaterialProps } from '@/hooks'

interface Props {
    editCompConfig: TypeEditCompStatus
    sn: number | null
}
const props = defineProps<Props>()

const currentType = computed(() => {
    return props.editCompConfig.type?.currentStage
})

const { computedState, alignClassMap } = useMaterialProps<TypeEditCompStatus>(props)
</script>

<template>
    <div
        class="text-node"
        :class="[alignClassMap[computedState.position]]"
    >
        <h1
            class="pt-10 pb-10"
            v-if="currentType === 0"
            :style="{
                fontSize: `${computedState.titleSize}px`,
                color: `${computedState.titleColor}`
            }"
            :class="[
                !computedState.isTitleBold ? 'font-bold' : 'font-weight-200',
                !computedState.isTitleSlant ? 'font-italic' : ''
            ]"
        >
            {{ computedState.title }}
        </h1>
        <p
            v-else-if="currentType === 1"
            :style="{
                fontSize: `${computedState.descSize}px`,
                color: `${computedState.descColor}`
            }"
            :class="[
                !computedState.isDescBold ? 'font-bold' : 'font-weight-400',
                !computedState.isDescSlant ? 'font-italic' : ''
            ]"
        >
            {{ computedState.desc }}
        </p>
    </div>
</template>

<style scoped lang="scss"></style>
