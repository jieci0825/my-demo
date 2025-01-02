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
    <div :class="['option-select', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div class="choose-wrap">
            <el-select
                clearable
                placeholder="请选择"
                style="width: 240px"
            >
                <el-option
                    v-for="(item, idx) in computedState.options"
                    :key="idx"
                    :label="item"
                    :value="idx"
                />
            </el-select>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
