<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import { computed, ref } from 'vue'
import { useMaterialProps } from '@/hooks'
import { UPDATE_ANSWER } from '@/constants'
import type { TypeEditCompStatus, ValueState } from '@/types'

interface IProps {
    editCompConfig: TypeEditCompStatus
    sn: number
}
const props = defineProps<IProps>()
const emits = defineEmits([UPDATE_ANSWER])

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<TypeEditCompStatus>(props)

const type = computed(() => {
    return props.editCompConfig.type?.state[computedState?.value.type!] as ValueState
})

const innerValue = ref('')
</script>

<template>
    <div :class="['date-time', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div>
            <el-date-picker
                placeholder="请选择日期"
                v-model="innerValue"
                :type="type?.value"
                @change="emits(UPDATE_ANSWER, innerValue)"
                @click.stop
            />
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
