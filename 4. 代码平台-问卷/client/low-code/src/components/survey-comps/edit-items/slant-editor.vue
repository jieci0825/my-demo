<script setup lang="ts">
import { useEditItemButtonGroup } from '@/hooks'

interface Props {
    editConfKey: string
    state: Array<string>
    icons: string[]
    title: string
    currentStage: number
    id: string
    isShow: boolean
}
const props = defineProps<Props>()

const { buttonGroupProps, innerValue, ButtonGroup } = useEditItemButtonGroup(props)
</script>

<template>
    <div class="editor-item-wrap">
        <div class="editor-item-wrap">
            <ButtonGroup v-bind="buttonGroupProps">
                <el-radio-group v-model="innerValue">
                    <el-radio-button
                        v-for="(item, idx) in props.state"
                        :value="idx"
                        :title="item"
                    >
                        <span
                            :style="{ '--idx': idx }"
                            :class="['iconfont', props.icons[idx]]"
                        ></span>
                    </el-radio-button>
                </el-radio-group>
            </ButtonGroup>
        </div>
    </div>
</template>

<style scoped lang="scss">
.editor-item-wrap {
    .iconfont {
        font-size: calc(var(--idx) * 2px + 12px);
    }
}
</style>
