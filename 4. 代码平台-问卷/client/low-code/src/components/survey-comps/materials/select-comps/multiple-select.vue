<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import { useMaterialProps } from '@/hooks'
import { ref } from 'vue'
import { UPDATE_ANSWER } from '@/constants'
import type { OptionEditCompStatus } from '@/types'

interface IProps {
    editCompConfig: OptionEditCompStatus
    sn: number
}
const props = defineProps<IProps>()
const emits = defineEmits([UPDATE_ANSWER])

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<OptionEditCompStatus>(props)

const innerValue = ref([])
</script>

<template>
    <div :class="['multiple-select', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div class="choose-wrap">
            <el-checkbox-group
                v-model="innerValue"
                @change="emits(UPDATE_ANSWER, innerValue)"
                @clcik.stop
            >
                <el-checkbox
                    v-for="(item, idx) in computedState.options"
                    :key="idx"
                    :value="idx"
                    :label="item as string"
                />
            </el-checkbox-group>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
