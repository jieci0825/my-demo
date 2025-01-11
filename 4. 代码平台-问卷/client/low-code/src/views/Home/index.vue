<script setup lang="ts">
import { JC_WEN_JUAN_ACTIVE_VIEW } from '@/constants'
import { deleteSurveryDataById, getAllSurveryData } from '@/db/operation'
import { Plus, Compass, View, Delete, EditPen } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils'
import type { SurveyDBData, SurveyDBReturnData } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'

const $router = useRouter()

const tableData = ref<SurveyDBData[]>([])

const fetchData = async () => {
    const resp = await getAllSurveryData()
    for (const item of resp) {
        item.createDate = formatDate(item.createDate)
        item.updateDate = formatDate(item.updateDate)
    }
    tableData.value = resp
}
fetchData()

const goToCreateEditor = () => {
    // 当前激活视图是编辑器
    localStorage.setItem(JC_WEN_JUAN_ACTIVE_VIEW, 'editor')
    $router.push(`/editor/survey-type`)
}
const goToMaterials = () => {
    // 当前激活视图是组件市场
    localStorage.setItem(JC_WEN_JUAN_ACTIVE_VIEW, 'materials')
    $router.push('/materials')
}
const goToPreview = (row: SurveyDBReturnData) => {
    $router.push({
        path: `/preview/${row.id}`,
        state: {
            from: 'home'
        }
    })
}
const goToEdit = (row: SurveyDBReturnData) => {
    $router.push(`/editor/${row.id}/survey-type`)
}

const deleteSurvey = async (row: SurveyDBReturnData) => {
    try {
        const message = `确定删除问卷《${row.title}》吗？`
        await ElMessageBox.confirm(message, '提示', {
            type: 'warning'
        })
    } catch (error) {
        ElMessage.info('取消删除')
        return
    }

    try {
        await deleteSurveryDataById(row.id)
        ElMessage.success('删除成功')
    } catch (error) {
        ElMessage.error('删除失败')
    }
}
</script>

<template>
    <div class="home-container flex flex-direction-column align-items-center">
        <!-- 标题 -->
        <h1 class="title font-weight-600 mt-30">JC问卷系统</h1>
        <!-- main -->
        <div class="main mt-40">
            <!-- 按钮组 -->
            <div class="actions mb-10">
                <el-button
                    @click="goToCreateEditor"
                    :icon="Plus"
                    type="primary"
                    >创建问卷</el-button
                >
                <el-button
                    @click="goToMaterials"
                    :icon="Compass"
                    type="success"
                    >组件市场</el-button
                >
            </div>
            <!-- table -->
            <el-table
                style="border-radius: var(--border-radius-base)"
                :data="tableData"
                border
            >
                <el-table-column
                    fixed
                    prop="createDate"
                    label="创建日期"
                    width="160"
                    align="center"
                />
                <el-table-column
                    prop="title"
                    label="问卷标题"
                    align="center"
                />
                <el-table-column
                    prop="surveyCount"
                    label="题目数"
                    width="150"
                    align="center"
                />
                <el-table-column
                    prop="updateDate"
                    label="最近更新日期"
                    width="160"
                    align="center"
                />
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="300"
                    align="center"
                >
                    <template #default="scope">
                        <el-button
                            type="primary"
                            size="small"
                            plain
                            :icon="View"
                            @click="goToPreview(scope.row)"
                            >查看问卷</el-button
                        >
                        <el-button
                            type="primary"
                            size="small"
                            plain
                            :icon="EditPen"
                            @click="goToEdit(scope.row)"
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            size="small"
                            plain
                            :icon="Delete"
                            @click="deleteSurvey(scope.row)"
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
@font-face {
    font-family: '阿里妈妈数黑体 Bold';
    font-weight: 700;
    src: url('//at.alicdn.com/wf/webfont/QdJkIkEeNscy/pJLChFrkPRG9.woff2') format('woff2'),
        url('//at.alicdn.com/wf/webfont/QdJkIkEeNscy/Un8d9FV0jhk4.woff') format('woff');
    font-display: swap;
}

.home-container {
    .title {
        color: var(--font-title-color);
        font-size: 50px;
        font-family: '阿里妈妈数黑体 Bold';
    }
    .main {
        width: var(--center-width);
    }
}
</style>
