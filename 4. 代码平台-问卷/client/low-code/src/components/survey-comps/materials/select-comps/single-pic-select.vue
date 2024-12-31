<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import PicItem from '../../common/pic-item.vue'
import { computed, inject } from 'vue'
import { useMaterialProps } from '@/hooks'
import type { OptionEditCompStatus, PicTitleDescState } from '@/types'

interface IProps {
    editCompConfig: OptionEditCompStatus
    sn: number
}
const props = defineProps<IProps>()

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps(props)

const innerValue = computed({
    get() {
        return props.editCompConfig.options.currentStage
    },
    set(val) {
        // todo: 修改当前选中项
    }
})
</script>

<template>
    <div :class="['single-pic-select', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div class="radio-wrap">
            <el-radio-group v-model="innerValue">
                <el-radio
                    v-for="(item, idx) in (computedState.options as PicTitleDescState[])"
                    :key="idx"
                    :value="idx"
                    class="pic-item-wrap"
                >
                    <PicItem v-bind="item"></PicItem>
                </el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<style scoped lang="scss">
.single-pic-select {
    width: 100%;
    .pic-item-wrap {
        height: auto;
        flex-direction: column-reverse;
    }
}
</style>
