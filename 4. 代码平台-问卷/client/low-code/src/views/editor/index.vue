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
import { useRoute, useRouter } from 'vue-router'
import { getSurveryDataById, insertSurveryData, updateSurveryDataById } from '@/db/operation'
import { restoreComponentStatus } from '@/utils/process-indexDB-data'
import type { FullEditCompStatus, PicLink } from '@/types'

const $route = useRoute()
const $router = useRouter()

const editorStore = useEditorStore()

const editCompConfig = computed(() => {
    return editorStore.comps[editorStore.currentCompIndex]?.editCompConfig
})

const updateState = dispatchStatus(editorStore, editCompConfig as ComputedRef<FullEditCompStatus>)

const getPicLink = (payload: PicLink) => {
    updateState('options', payload)
}

const fetchData = async () => {
    const resp = await getSurveryDataById(+$route.params.id)
    if (!resp) return
    restoreComponentStatus(resp.comps)
    editorStore.setStore(resp.comps)
}
// 是否是编辑状态
const isEditStatus = computed(() => !!$route.params.id)
if (isEditStatus.value) {
    // 如果存在id，则表示需要是编辑状态，需要从数据库中拿去问卷数据
    fetchData()
} else {
    editorStore.resetComps()
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

const handleUpdate = async () => {
    const currentId = +$route.params.id
    const timestamp = Date.now()
    updateSurveryDataById(currentId, {
        comps: JSON.parse(JSON.stringify(editorStore.comps)),
        updateDate: timestamp,
        surveyCount: editorStore.surveyCount
    })
}

const handlePreview = async () => {
    try {
        await ElMessageBox.confirm('预览问卷会对问卷进行保存，是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
    } catch (error) {
        ElMessage.info('取消预览')
        return
    }

    try {
        const timestamp = Date.now()
        // 编辑状态的预览则进行更新
        if (isEditStatus.value) {
            const currentId = +$route.params.id
            await updateSurveryDataById(currentId, {
                comps: JSON.parse(JSON.stringify(editorStore.comps)),
                updateDate: timestamp,
                surveyCount: editorStore.surveyCount
            })
            $router.push({
                path: `/preview/${currentId}`,
                state: { from: 'editor' }
            })
        }
        // 新建问卷的预览则进行保存
        else {
            const id = await insertSurveryData({
                title: '新建问卷-未命名',
                createDate: timestamp,
                updateDate: timestamp,
                surveyCount: editorStore.surveyCount,
                comps: JSON.parse(JSON.stringify(editorStore.comps))
            })
            $router.push({
                path: `/preview/${id}`,
                state: { from: 'editor' }
            })
        }
    } catch (error) {
        ElMessage.error('预览失败')
    }
}

provide(UPDATE_STATE, updateState)
provide(GET_PIC_LINK, getPicLink)
</script>

<template>
    <div class="editor-container">
        <PageHeader :title="isEditStatus ? '编辑问卷' : '新建问卷'">
            <template #center>
                <template v-if="isEditStatus">
                    <el-button
                        type="warning"
                        @click="handleUpdate"
                        >更新问卷</el-button
                    >
                </template>
                <template v-else>
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
                </template>
                <el-button
                    type="primary"
                    @click="handlePreview"
                    >预览问卷</el-button
                >
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
        width: var(--center-width);
        margin: 0 auto;
        padding: 20px;
        height: calc(100vh - 60px);
    }
}
</style>
