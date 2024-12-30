<script setup lang="ts">
import { UPDATE_STATE } from '@/constants'
import { inject, ref } from 'vue'
import { Plus, Minus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Props {
    editConfKey: string
    state: Array<string>
    currentStage: number
    id: string
    isShow: boolean
}
const props = defineProps<Props>()
const updateState = inject(UPDATE_STATE)

const textArr = ref(props.state)

const addOption = () => {
    const len = textArr.value.length
    if (len >= 10) {
        ElMessage.error('最多只能添加10个选项')
        return
    }
    updateState && updateState(props.editConfKey)
}
const removeOption = (idx: number) => {
    if (textArr.value.length <= 2) {
        ElMessage.error('至少保留两个选项')
        return
    }
    updateState && updateState(props.editConfKey, idx)
}
</script>

<template>
    <div class="editor-item-wrap">
        <div class="sign flex align-items-center">
            <span>题目选项</span>
            <el-button
                @click="addOption"
                :icon="Plus"
                size="small"
                class="ml-10"
                circle
            ></el-button>
        </div>
        <div class="option-list">
            <div
                v-for="(_, idx) in props.state"
                :key="idx"
                class="option-item flex align-items-center"
            >
                <el-input
                    v-model="textArr[idx]"
                    placeholder="请输入选项内容"
                ></el-input>
                <el-button
                    @click="removeOption(idx)"
                    :icon="Minus"
                    size="small"
                    type="danger"
                    class="ml-10"
                    plain
                    circle
                ></el-button>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.editor-item-wrap {
    width: 100%;
    .option-list {
        .option-item {
            margin-bottom: 10px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>
