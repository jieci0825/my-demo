<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import PicItem from '../../common/pic-item.vue'
import { ref } from 'vue'
import { useMaterialProps } from '@/hooks'
import { UPDATE_ANSWER } from '@/constants'
import type { OptionEditCompStatus, PicTitleDescState } from '@/types'

interface IProps {
    editCompConfig: OptionEditCompStatus
    sn: number
}
const props = defineProps<IProps>()
const emits = defineEmits([UPDATE_ANSWER])

const { computedState, materialHeaderProps, alignClassMap } = useMaterialProps<OptionEditCompStatus>(props)

const innerValue = ref([])

const options = props.editCompConfig.options.state
</script>

<template>
    <div :class="['multiple-pic-select', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div class="choose-wrap flex wrap">
            <el-checkbox-group
                class="flex wrap"
                v-model="innerValue"
                @change="emits(UPDATE_ANSWER, innerValue)"
                @click.stop
            >
                <el-checkbox
                    class="pic-item-wrap flex mb-15"
                    v-for="(item, idx) in (options as PicTitleDescState[])"
                    :key="idx"
                    :value="idx"
                >
                    <PicItem
                        v-bind="item"
                        :idx="idx"
                        :key="idx"
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
