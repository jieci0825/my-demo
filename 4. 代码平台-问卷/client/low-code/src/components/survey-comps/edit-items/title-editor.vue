<script setup lang="ts">
import { UPDATE_STATE } from '@/constants'
import { computed, inject } from 'vue'

interface Props {
    editConfKey: string
    state: string
    id: string
    isShow: boolean
}
const props = defineProps<Props>()
const updateState = inject(UPDATE_STATE)

const innerValue = computed({
    get() {
        return props.state
    },
    set(newValue: any) {
        updateState && updateState(props.editConfKey, newValue)
    }
})
</script>

<template>
    <div class="title-editor">
        <div class="sign mb-10 font-weight-500">标题内容</div>
        <el-input
            v-model="innerValue"
            placeholder="请输入题目标题"
        ></el-input>
    </div>
</template>

<style scoped lang="scss">
.title-editor {
    width: 100%;
}
</style>
