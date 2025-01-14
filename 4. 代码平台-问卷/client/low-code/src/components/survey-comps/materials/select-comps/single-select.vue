<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import { UPDATE_ANSWER } from '@/constants'
import { useMaterialProps } from '@/hooks'
import { ref } from 'vue'
import type { OptionEditCompStatus } from '@/types'

interface IProps {
    editCompConfig: OptionEditCompStatus
    sn: number
}
const props = defineProps<IProps>()
const emits = defineEmits([UPDATE_ANSWER])

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<OptionEditCompStatus>(props)

const innerValue = ref('')
</script>

<template>
    <div :class="['single-select', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div class="choose-wrap">
            <el-radio-group
                v-model="innerValue"
                @change="emits(UPDATE_ANSWER, innerValue)"
                @click.stop
            >
                <el-radio
                    v-for="(item, idx) in computedState.options"
                    :key="idx"
                    :value="idx"
                    >{{ item }}</el-radio
                >
            </el-radio-group>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
