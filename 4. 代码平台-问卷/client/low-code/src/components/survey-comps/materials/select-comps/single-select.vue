<script setup lang="ts">
import MaterialsHeader from '../../common/materials-header.vue'
import { computed } from 'vue'
import type { OptionEditCompStatus } from '@/types'

interface IProps {
    editCompConfig: OptionEditCompStatus
    sn: number
}

// props.editCompStatus 得到的是
const { editCompConfig, sn } = defineProps<IProps>()

const computedState = computed(() => {
    const {
        title,
        desc,
        options,
        position,
        titleSize,
        descSize,
        titleBold,
        descBold,
        titleSlant,
        descSlant,
        titleColor,
        descColor
    } = editCompConfig
    return {
        title: title.state,
        desc: desc.state,
        options: options.state,
        position: position.currentStage,
        titleSize: titleSize.state[titleSize.currentStage],
        descSize: descSize.state[descSize.currentStage],
        isTitleBold: !!titleBold.currentStage,
        isDescBold: !!descBold.currentStage,
        isTitleSlant: !!titleSlant.currentStage,
        isDescSlant: !!descSlant.currentStage,
        titleColor: titleColor.state,
        descColor: descColor.state
    }
})

const materialHeaderProps = computed(() => {
    const {
        title,
        desc,
        titleSize,
        descSize,
        isTitleBold,
        isDescBold,
        isDescSlant,
        isTitleSlant,
        titleColor,
        descColor
    } = computedState.value
    return {
        sn,
        title,
        desc,
        titleSize,
        descSize,
        isTitleBold,
        isDescBold,
        isDescSlant,
        isTitleSlant,
        titleColor,
        descColor
    }
})

const alignClassMap: any = {
    0: '',
    1: 'text-center',
    2: 'text-right'
}
</script>

<template>
    <div :class="['single-select', alignClassMap[computedState.position]]">
        <MaterialsHeader v-bind="materialHeaderProps"></MaterialsHeader>
        <div class="radio-wrap">
            <el-radio-group>
                <el-radio
                    v-for="(item, idx) in computedState.options"
                    :key="idx"
                    :value="item"
                    >{{ item }}</el-radio
                >
            </el-radio-group>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
