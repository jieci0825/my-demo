<script setup lang="ts">
import ButtonGroup from './button-group.vue'
import { computed, inject } from 'vue'
import { UPDATE_STATE } from '@/constants'

interface Props {
    editConfKey: string
    state: Array<string>
    icons: string[]
    currentStage: number
    id: string
    isShow: boolean
}
const props = defineProps<Props>()

const updateState = inject(UPDATE_STATE)

const innerValue = computed({
    get() {
        return props.currentStage
    },
    set(val) {
        updateState && updateState(props.editConfKey, val)
    }
})

const buttonGroupProps = computed(() => {
    return {
        label: '对齐方式',
        text: props.state[props.currentStage]
    }
})
</script>

<template>
    <div class="editor-item-wrap">
        <ButtonGroup v-bind="buttonGroupProps">
            <el-radio-group v-model="innerValue">
                <el-radio-button
                    v-for="(item, idx) in props.state"
                    :value="idx"
                    :title="item"
                >
                    <span :class="['iconfont', props.icons[idx]]"></span>
                </el-radio-button>
            </el-radio-group>
        </ButtonGroup>
    </div>
</template>

<style scoped lang="scss"></style>
