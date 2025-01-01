<script setup lang="ts">
import { UPDATE_STATE } from '@/constants'
import { Minus, Plus } from '@element-plus/icons-vue'
import { inject } from 'vue'
import type { PicLink, PicTitleDescState, PicTitleDescStateArr } from '@/types'

interface Props {
    editConfKey: string
    state: PicTitleDescStateArr
    currentStage: number
    id: string
    isShow: boolean
}
const props = defineProps<Props>()

const updateState = inject(UPDATE_STATE)

const removeOption = (idx: number) => {
    updateState && updateState(props.editConfKey, idx)
}

let prevCount = props.state.length
const addOption = () => {
    prevCount++
    const data: PicTitleDescState = {
        picTitle: `图片标题${prevCount}`,
        picDesc: `图片描述${prevCount}`,
        value: ''
    }
    updateState && updateState(props.editConfKey, data)
}

const removeImage = (idx: number) => {
    const picLink: PicLink = {
        link: '',
        idx
    }
    updateState && updateState(props.editConfKey, picLink)
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
        <div class="options-list">
            <div
                class="option-item"
                v-for="(item, idx) in props.state"
                :key="idx"
            >
                <div class="flex align-items-center mb-8">
                    <span>选项{{ idx + 1 }}</span>
                    <el-button
                        class="ml-5"
                        type="primary"
                        size="small"
                        circle
                        :icon="Minus"
                        @click="removeOption(idx)"
                    ></el-button>
                </div>
                <div class="mb-5">
                    <span>{{ item.value ? '已上传图片' : '未上传图片' }}</span>
                    <el-link
                        class="ml-5"
                        type="primary"
                        v-if="!!item.value"
                        @click="removeImage(idx)"
                        >删除图片</el-link
                    >
                </div>
                <div class="mb-5">
                    <el-input
                        placeholder="请输入选项的标题"
                        v-model="item.picTitle"
                    ></el-input>
                </div>
                <div>
                    <el-input
                        type="textarea"
                        placeholder="请输入选项的描述"
                        resize="none"
                        v-model="item.picDesc"
                        :rows="3"
                    ></el-input>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.editor-item-wrap {
    .options-list {
        font-size: 14px;
        .option-item {
            margin-bottom: 12px;
            gap: 5px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>
