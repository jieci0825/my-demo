<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import PicItem from '../../common/pic-item.vue'
import { computed } from 'vue'
import { useMaterialProps } from '@/hooks'
import type { OptionEditCompStatus, PicTitleDescState } from '@/types'

interface IProps {
    editCompConfig: OptionEditCompStatus
    sn: number
}
const props = defineProps<IProps>()

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<OptionEditCompStatus>(props)

const innerValue = computed({
    get() {
        return props.editCompConfig.options.currentStage
    },
    set(_) {
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
                    class="pic-item-wrap mb-15"
                >
                    <PicItem
                        v-bind="item"
                        :idx="idx"
                    ></PicItem>
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
