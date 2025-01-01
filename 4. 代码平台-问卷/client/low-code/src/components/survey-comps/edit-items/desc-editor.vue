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
    set(newValue: string) {
        updateState && updateState(props.editConfKey, newValue)
    }
})
</script>

<template>
    <div class="editor-item-wrap">
        <div class="sign">描述内容</div>
        <el-input
            v-model="innerValue"
            placeholder="请输入题目描述"
            type="textarea"
        ></el-input>
    </div>
</template>

<style scoped lang="scss"></style>
