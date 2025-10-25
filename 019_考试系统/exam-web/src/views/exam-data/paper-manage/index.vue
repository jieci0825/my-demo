<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { examPaperApi } from '@/api'
import ExamPaperForm from './components/exam-paper-form.vue'
import { useRouter } from 'vue-router'

// 响应式数据
const tableData = ref([])
const loading = ref(false)

// 表单相关状态
const formVisible = ref(false)
const formMode = ref('add') // 'add' 或 'edit'
const editData = ref(null)

const router = useRouter()

// 获取考卷列表
const getExamPapers = async () => {
    try {
        loading.value = true
        const response = await examPaperApi.getExamPaperList()
        tableData.value = response.data
    } catch (error) {
        ElMessage.error('获取考卷列表失败')
    } finally {
        loading.value = false
    }
}

// 添加考卷
const handleAdd = () => {
    formMode.value = 'add'
    editData.value = null
    formVisible.value = true
}

// 查看考卷详情
const handleView = row => {
    router.push({
        path: '/exam-paper',
        query: {
            id: row.id,
            action: 'preview'
        }
    })
}

// 编辑考卷
const handleEdit = async row => {
    try {
        // 获取完整的考卷数据
        const response = await examPaperApi.getExamPaperById(row.id)
        editData.value = response.data
        formMode.value = 'edit'
        formVisible.value = true
    } catch (error) {
        ElMessage.error('获取考卷详情失败')
    }
}

// 删除考卷
const handleDelete = async row => {
    try {
        await ElMessageBox.confirm(
            `确定要删除考卷 "${row.name}" 吗？`,
            '删除确认',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        )

        await examPaperApi.deleteExamPaperById(row.id)
        ElMessage.success('删除考卷成功')
        getExamPapers() // 刷新列表
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除考卷失败')
        }
    }
}

// 表单提交成功回调
const handleFormSuccess = () => {
    getExamPapers() // 刷新列表
}

const handleExam = row => {
    router.push({
        path: '/exam-paper',
        query: {
            id: row.id,
            action: 'exam'
        }
    })
}

// 组件挂载时获取数据
onMounted(() => {
    getExamPapers()
})
</script>

<template>
    <div class="paper-manage">
        <!-- 头部操作区 -->
        <div class="header-actions">
            <el-button
                type="primary"
                @click="handleAdd"
                size="default"
            >
                添加考卷
            </el-button>
        </div>

        <!-- 考卷列表表格 -->
        <el-table
            :data="tableData"
            v-loading="loading"
            stripe
            style="width: 70%"
            class="exam-table"
        >
            <el-table-column
                prop="id"
                label="ID"
                width="80"
                align="center"
            />
            <el-table-column
                prop="name"
                label="考卷名称"
                min-width="200"
            />
            <el-table-column
                prop="category"
                label="分类"
                width="120"
                align="center"
            />
            <el-table-column
                label="操作"
                width="260"
                align="center"
                fixed="right"
            >
                <template #default="{ row }">
                    <el-button
                        type="info"
                        size="small"
                        @click="handleView(row)"
                    >
                        查看
                    </el-button>
                    <el-button
                        type="primary"
                        size="small"
                        @click="handleExam(row)"
                    >
                        考试
                    </el-button>
                    <el-button
                        type="primary"
                        size="small"
                        @click="handleEdit(row)"
                    >
                        编辑
                    </el-button>
                    <el-button
                        type="danger"
                        size="small"
                        @click="handleDelete(row)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 考卷表单对话框 -->
        <ExamPaperForm
            v-model:visible="formVisible"
            :mode="formMode"
            :edit-data="editData"
            @success="handleFormSuccess"
        />
    </div>
</template>

<style scoped lang="scss">
.paper-manage {
    .header-actions {
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-start;
    }

    .exam-table {
        border-radius: 8px;
    }
}
</style>
