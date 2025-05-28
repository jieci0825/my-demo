<script setup lang="ts">
import { UPDATE_STATE } from '@/constants'
import { computed, inject, ref } from 'vue'

interface Props {
    editConfKey: string
    state: Array<string>
    currentStage: number
    id: string
    isShow: boolean
    isUse: boolean
}
const props = defineProps<Props>()

const updateState = inject(UPDATE_STATE)

const innerIsUse = computed({
    get() {
        return props.isUse
    },
    set(val) {
        updateState && updateState(props.editConfKey, val)
    }
})

const textArr = ref(props.state)
</script>

<template>
    <div class="editor-item-wrap">
        <div class="sign flex align-items-center">
            <span>辅助文字</span>
            <el-switch
                class="ml-10"
                v-model="innerIsUse"
            />
        </div>
        <transition name="el-zoom-in-top">
            <div
                class="option-list transition-box"
                v-if="innerIsUse"
            >
                <div
                    class="option-item"
                    v-for="(_, idx) in textArr"
                    :key="idx"
                >
                    <el-input
                        placeholder="请输入辅助文字"
                        clearable
                        v-model="textArr[idx]"
                    ></el-input>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped lang="scss">
.editor-item-wrap {
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
