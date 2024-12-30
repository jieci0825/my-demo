<script setup lang="ts">
import { computed } from 'vue'
import { SINGLE_SELECT_KEY } from '@/constants'
import type { BaseBusinessComp, OptionEditCompStatus } from '@/types'

interface Props {
    comp: BaseBusinessComp
}
const props = defineProps<Props>()

// 进一步确定类型
type PropsByOptions = BaseBusinessComp<OptionEditCompStatus>
const innerProps = computed(() => {
    if ([SINGLE_SELECT_KEY].includes(props.comp.type)) {
        return props.comp as PropsByOptions
    }
    return props.comp
})
</script>

<template>
    <div class="edit-panel p-20">
        <div
            v-for="(v, k) in innerProps.editCompConfig"
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
