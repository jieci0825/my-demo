<script setup lang="ts">
import type { BaseBusinessComp } from '@/types'

interface Props {
    comp: BaseBusinessComp
}
const props = defineProps<Props>()
</script>

<template>
    <div class="edit-panel p-20">
        <div
            v-for="(v, k) in props.comp.editCompConfig"
            :key="k"
            class="edit-item"
        >
            <Component
                v-if="v.isShow"
                v-bind="v"
                :is="v.editComp"
                :edit-conf-key="k"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
.edit-panel {
    width: 100%;
    height: 100%;
    .edit-item {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
}
</style>
