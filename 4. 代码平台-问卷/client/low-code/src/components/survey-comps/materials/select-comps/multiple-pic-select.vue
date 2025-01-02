<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import PicItem from '../../common/pic-item.vue'
import { useMaterialProps } from '@/hooks'
import type { OptionEditCompStatus, PicTitleDescState } from '@/types'

interface IProps {
    editCompConfig: OptionEditCompStatus
    sn: number
}
const props = defineProps<IProps>()

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<OptionEditCompStatus>(props)
</script>

<template>
    <div :class="['multiple-pic-select', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div class="choose-wrap flex wrap">
            <el-checkbox-group class="flex wrap">
                <el-checkbox
                    class="pic-item-wrap flex mb-15"
                    v-for="(item, idx) in (computedState.options as PicTitleDescState[])"
                    :key="idx"
                    :value="idx"
                >
                    <PicItem
                        :idx="idx"
                        v-bind="item"
                    ></PicItem>
                </el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>

<style scoped lang="scss">
.multiple-pic-select {
    width: 100%;
    .choose-wrap {
        .pic-item-wrap {
            height: auto;
            flex-direction: column-reverse;
        }
    }
}
</style>
