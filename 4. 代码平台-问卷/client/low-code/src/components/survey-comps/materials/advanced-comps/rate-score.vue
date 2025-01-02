<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import { useMaterialProps } from '@/hooks'
import type { OptionEditCompStatus } from '@/types'

interface IProps {
    editCompConfig: OptionEditCompStatus
    sn: number
}
const props = defineProps<IProps>()

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<OptionEditCompStatus>(props)
</script>

<template>
    <div :class="['rate-score', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div>
            <el-rate
                :texts="computedState.options"
                :show-text="editCompConfig.options?.isUse"
            />
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
