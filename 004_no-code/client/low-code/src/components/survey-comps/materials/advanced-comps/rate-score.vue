<script setup lang="ts">
import { UPDATE_ANSWER } from '@/constants'
import MaterialsHeader from '../../common/materials-header.vue'
import { useMaterialProps } from '@/hooks'
import type { OptionEditCompStatus } from '@/types'
import { ref } from 'vue'

interface IProps {
    editCompConfig: OptionEditCompStatus
    sn: number
}
const props = defineProps<IProps>()
const emits = defineEmits([UPDATE_ANSWER])

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<OptionEditCompStatus>(props)

const innerValue = ref(0)
</script>

<template>
    <div :class="['rate-score', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div>
            <el-rate
                v-model="innerValue"
                :texts="computedState.options"
                :show-text="editCompConfig.options?.isUse"
                @change="emits(UPDATE_ANSWER, innerValue)"
                @click.stop
            />
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
