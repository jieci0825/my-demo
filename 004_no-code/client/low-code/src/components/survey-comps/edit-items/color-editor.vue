<script setup lang="ts">
import { useEditItemButtonGroup } from '@/hooks'

interface Props {
    editConfKey: string
    state: string
    title: string
    id: string
    isShow: boolean
    predefineColors: Array<string>
}
const props = defineProps<Props>()

const { buttonGroupProps, innerValue, ButtonGroup } = useEditItemButtonGroup(props)
</script>

<template>
    <div class="editor-item-wrap">
        <div class="editor-item-wrap">
            <ButtonGroup v-bind="buttonGroupProps">
                <el-color-picker
                    v-model="innerValue"
                    :predefine="props.predefineColors"
                    show-alpha
                />
            </ButtonGroup>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
