<script setup lang="ts">
import { useEditItemButtonGroup } from '@/hooks'
import type { ValueStateArr } from '@/types'

interface Props {
    editConfKey: string
    state: ValueStateArr
    title: string
    currentStage: number
    id: string
    isShow: boolean
}
const props = defineProps<Props>()

const { buttonGroupProps, updateState, ButtonGroup } = useEditItemButtonGroup(props)

const textArr = props.state.map(item => item.value)

const changeType = (value: string) => {
    const idx = textArr.indexOf(value)
    updateState && updateState(props.editConfKey, idx)
}
</script>

<template>
    <div class="editor-item-wrap">
        <ButtonGroup v-bind="buttonGroupProps">
            <el-select
                @change="changeType"
                placeholder="日期类型"
                style="width: 100px"
            >
                <el-option
                    v-for="item in props.state"
                    :key="item.value"
                    :label="item.state"
                    :value="item.value"
                />
            </el-select>
        </ButtonGroup>
    </div>
</template>

<style scoped lang="scss">
.editor-item-wrap {
    .iconfont {
        font-size: calc(var(--idx) * 2px + 12px);
    }
}
</style>
