<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getQuestionList, deleteQuestionById } from '@/api/modules/question'
import { QuestionTypeOptions } from '@/config'
import QuestionForm from './components/question-form.vue'

// 响应式数据
const loading = ref(false)
const tableData = ref([])
const total = ref(0)

// 分页参数
const pagination = reactive({
    page: 1,
    limit: 10
})

// 搜索条件
const searchForm = reactive({
    type: '',
    title: ''
})

// 获取题目列表
const getList = async () => {
    try {
        loading.value = true
        const params = {
            page: pagination.page,
            limit: pagination.limit,
            ...searchForm
        }

        // 过滤空值
        Object.keys(params).forEach(key => {
            if (params[key] === '') {
                delete params[key]
            }
        })

        const { data } = await getQuestionList(params)
        tableData.value = data.list
        total.value = data.total
    } catch (error) {
        ElMessage.error('获取题目列表失败')
    } finally {
        loading.value = false
    }
}

// 搜索
const handleSearch = () => {
    pagination.page = 1 // 搜索时重置页码
    getList()
}

// 重置搜索条件
const handleReset = () => {
    searchForm.type = ''
    searchForm.title = ''
    pagination.page = 1
    getList()
}

// 分页变化
const handlePageChange = page => {
    pagination.page = page
    getList()
}

const handleSizeChange = size => {
    pagination.limit = size
    pagination.page = 1
    getList()
}

// 表单对话框状态
const formVisible = ref(false)
const formMode = ref('add') // 'add' 或 'edit'
const editData = ref(null)

// 添加问题
const handleAddQuestion = () => {
    formMode.value = 'add'
    editData.value = null
    formVisible.value = true
}

// 编辑问题
const handleEditQuestion = row => {
    formMode.value = 'edit'
    editData.value = { ...row }
    formVisible.value = true
}

// 删除问题
const handleDeleteQuestion = async row => {
    try {
        await ElMessageBox.confirm(`确定要删除题目"${row.question}"吗？`, '删除确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })

        await deleteQuestionById(row.id)
        ElMessage.success('删除问题成功')
        getList()
    } catch (error) {
        if (error !== 'cancel') {
            ElMessage.error('删除问题失败')
        }
    }
}

// 表单提交成功回调
const handleFormSuccess = () => {
    getList() // 重新获取列表数据
}

// 获取题目类型标签
const getTypeLabel = type => {
    const option = QuestionTypeOptions.find(item => item.value === type)
    return option ? option.label : type
}

// 监听搜索条件变化
watch(
    [() => searchForm.type, () => searchForm.title],
    () => {
        if (searchForm.type !== '' || searchForm.title !== '') {
            handleSearch()
        }
    },
    { deep: true }
)

// 页面加载时获取数据
onMounted(() => {
    getList()
})
</script>

<template>
    <div class="question-manage">
        <!-- 头部操作区 -->
        <div class="header-actions">
            <div class="left-actions">
                <el-button
                    type="primary"
                    @click="handleAddQuestion"
                >
                    添加问题
                </el-button>
            </div>

            <div class="right-filters">
                <el-form
                    :model="searchForm"
                    inline
                    class="search-form"
                >
                    <el-form-item label="类型：">
                        <el-select
                            v-model="searchForm.type"
                            placeholder="请选择题目类型"
                            clearable
                            style="width: 150px"
                        >
                            <el-option
                                v-for="item in QuestionTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item label="标题：">
                        <el-input
                            v-model="searchForm.title"
                            placeholder="请输入题目标题"
                            clearable
                            style="width: 200px"
                            @keyup.enter="handleSearch"
                        />
                    </el-form-item>

                    <el-form-item>
                        <el-button
                            type="primary"
                            @click="handleSearch"
                        >
                            搜索
                        </el-button>
                        <el-button @click="handleReset"> 重置 </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <!-- 题目表格 -->
        <div class="table-container">
            <el-table
                :data="tableData"
                v-loading="loading"
                style="width: 100%"
                stripe
            >
                <el-table-column
                    prop="sn"
                    label="序号"
                    width="80"
                    align="center"
                />

                <el-table-column
                    prop="question"
                    label="题目内容"
                    min-width="300"
                    show-overflow-tooltip
                />

                <el-table-column
                    prop="type"
                    label="题目类型"
                    width="120"
                    align="center"
                >
                    <template #default="{ row }">
                        <el-tag
                            :type="
                                row.type === 'choice' ? 'primary' : row.type === 'short-answer' ? 'success' : 'warning'
                            "
                        >
                            {{ getTypeLabel(row.type) }}
                        </el-tag>
                    </template>
                </el-table-column>

                <el-table-column
                    label="操作"
                    width="160"
                    align="center"
                >
                    <template #default="{ row }">
                        <el-button
                            type="primary"
                            size="small"
                            text
                            @click="handleEditQuestion(row)"
                        >
                            编辑
                        </el-button>
                        <el-button
                            type="danger"
                            size="small"
                            text
                            @click="handleDeleteQuestion(row)"
                        >
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- 分页器 -->
        <div class="pagination-container">
            <el-pagination
                v-model:current-page="pagination.page"
                v-model:page-size="pagination.limit"
                :page-sizes="[10, 20, 50, 100]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handlePageChange"
            />
        </div>

        <!-- 问题表单对话框 -->
        <QuestionForm
            v-model:visible="formVisible"
            :mode="formMode"
            :edit-data="editData"
            @success="handleFormSuccess"
        />
    </div>
</template>

<style scoped lang="scss">
.question-manage {
    .header-actions {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        padding: 20px;
        background: #fff;
        border-radius: 8px;

        .left-actions {
            display: flex;
            align-items: center;
        }

        .right-filters {
            .search-form {
                margin: 0;

                :deep(.el-form-item) {
                    margin-bottom: 0;
                    margin-right: 16px;

                    &:last-child {
                        margin-right: 0;
                    }
                }
            }
        }
    }

    .table-container {
        background: #fff;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
    }

    .pagination-container {
        display: flex;
        justify-content: center;
        padding: 20px;
        background: #fff;
        border-radius: 8px;
    }
}
</style>
