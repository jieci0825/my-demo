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
    <div :class="['multiple-select', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div class="choose-wrap">
            <el-checkbox-group>
                <el-checkbox
                    v-for="(item, idx) in computedState.options"
                    :key="idx"
                    :value="item"
                    :label="item"
                />
            </el-checkbox-group>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
