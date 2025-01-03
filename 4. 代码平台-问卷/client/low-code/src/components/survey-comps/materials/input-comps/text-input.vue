<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import { useMaterialProps } from '@/hooks'
import type { TypeEditCompStatus } from '@/types'

interface IProps {
    editCompConfig: TypeEditCompStatus
    sn: number
}
const props = defineProps<IProps>()

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<TypeEditCompStatus>(props)
</script>

<template>
    <div :class="['text-input', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>

        <div class="input-wrap">
            <el-input
                v-if="computedState.type === 0"
                type="text"
            />
            <el-input
                v-else
                type="textarea"
                resize="none"
                :rows="4"
            ></el-input>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
