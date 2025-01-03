<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import { computed } from 'vue'
import { useMaterialProps } from '@/hooks'
import type { TypeEditCompStatus, ValueState } from '@/types'

interface IProps {
    editCompConfig: TypeEditCompStatus
    sn: number
}
const props = defineProps<IProps>()

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<TypeEditCompStatus>(props)

const type = computed(() => {
    return props.editCompConfig.type?.state[computedState?.value.type!] as ValueState
})
</script>

<template>
    <div :class="['date-time', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div>
            <el-date-picker
                placeholder="请选择日期"
                :type="type?.value"
                @click.stop
            />
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
