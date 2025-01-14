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

const innerValue = ref('')

const options = props.editCompConfig.options.state
</script>

<template>
    <div :class="['single-pic-select', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div class="choose-wrap">
            <el-radio-group
                v-model="innerValue"
                @change="emits(UPDATE_ANSWER, innerValue)"
                @click.stop
            >
                <el-radio
                    class="pic-item-wrap mb-15"
                    v-for="(item, idx) in (options as PicTitleDescState[])"
                    :key="idx"
                    :value="idx"
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
