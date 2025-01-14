<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import { useMaterialProps } from '@/hooks'
import { ref } from 'vue'
import type { TypeEditCompStatus } from '@/types'
import { UPDATE_ANSWER } from '@/constants'

interface IProps {
    editCompConfig: TypeEditCompStatus
    sn: number
}
const props = defineProps<IProps>()
const emits = defineEmits([UPDATE_ANSWER])

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<TypeEditCompStatus>(props)

const innerValue = ref('')
</script>

<template>
    <div :class="['text-input', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>

        <div class="input-wrap">
            <el-input
                v-if="computedState.type === 0"
                type="text"
                v-model="innerValue"
                @change="emits(UPDATE_ANSWER, innerValue)"
                @click.stop
            />
            <el-input
                v-else
                type="textarea"
                resize="none"
                v-model="innerValue"
                :rows="4"
                @change="emits(UPDATE_ANSWER, innerValue)"
                @click.stop
            ></el-input>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
