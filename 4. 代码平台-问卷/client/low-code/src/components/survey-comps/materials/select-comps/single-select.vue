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
    return {
        title: editCompConfig.title.state,
        desc: editCompConfig.desc.state,
        options: editCompConfig.options.state
    }
})
console.log(computedState.value)
</script>

<template>
    <div class="single-select">
        <MaterialsHeader
            :sn="sn"
            :title="computedState.title"
            :desc="computedState.desc"
        ></MaterialsHeader>
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
