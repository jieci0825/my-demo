<script setup lang="ts">
import PageHeader from '@/components/common/page-header/index.vue'
import LeftSide from './left-side/index.vue'
import RightSide from './right-side/index.vue'
import CenterContainer from './center/index.vue'
import { GET_PIC_LINK, UPDATE_STATE } from '@/constants'
import { useEditorStore } from '@/stores/use-editor'
import { computed, provide, type ComputedRef } from 'vue'
import { dispatchStatus } from '@/stores/common-dispatch'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FullEditCompStatus, PicLink } from '@/types'

const editorStore = useEditorStore()

const editCompConfig = computed(() => {
    return editorStore.comps[editorStore.currentCompIndex]?.editCompConfig
})

const updateState = dispatchStatus(editorStore, editCompConfig as ComputedRef<FullEditCompStatus>)

const getPicLink = (payload: PicLink) => {
    updateState('options', payload)
}

const handleReset = async () => {
    try {
        await ElMessageBox.confirm('确定要重置问卷吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
        editorStore.resetComps()
    } catch (error) {
        console.log(error)
    }
}

const handleSave = async () => {
    try {
        const { value: title } = await ElMessageBox.prompt('请输入本次问卷的标题', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: '标题不能为空'
        })
        const timestamp = Date.now()
        editorStore
            .saveComp({
                title,
                comps: JSON.parse(JSON.stringify(editorStore.comps)),
                createDate: timestamp,
                updateDate: timestamp,
                surveyCount: editorStore.surveyCount
            })
            .then(() => {
                ElMessage.success('问卷保存成功')
            })
            .catch(() => {
                ElMessage.error('问卷保存失败')
            })
    } catch (error) {
        ElMessage.info('取消保存')
    }
}

provide(UPDATE_STATE, updateState)
provide(GET_PIC_LINK, getPicLink)
</script>

<template>
    <div class="editor-container">
        <PageHeader>
            <template #center>
                <el-button
                    @click="handleReset"
                    type="danger"
                    >重置问卷</el-button
                >
                <el-button
                    @click="handleSave"
                    type="success"
                    >保存问卷</el-button
                >
                <el-button type="warning">更新问卷</el-button>
                <el-button type="primary">预览问卷</el-button>
            </template>
        </PageHeader>
        <div class="main flex">
            <LeftSide></LeftSide>
            <CenterContainer> </CenterContainer>
            <RightSide></RightSide>
        </div>
    </div>
</template>

<style scoped lang="scss">
.editor-container {
    width: 100%;
    height: 100%;
    .main {
        margin: 0 auto;
        padding: 20px;
        height: calc(100vh - 60px);
    }
}
</style>
