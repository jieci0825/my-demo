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

const innerValue = ref('')

// 单独获取，防止仓库更新导致这部分组件更新产生的渲染错误
const options = props.editCompConfig.options.state
</script>

<template>
    <div :class="['option-select', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div class="choose-wrap">
            <el-select
                clearable
                placeholder="请选择"
                style="width: 240px"
                v-model="innerValue"
                @change="emits(UPDATE_ANSWER, innerValue)"
                @click.stop
            >
                <el-option
                    v-for="(item, idx) in options"
                    :key="idx"
                    :label="item"
                    :value="item"
                />
            </el-select>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
