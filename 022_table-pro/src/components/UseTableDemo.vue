<script setup lang="ts">
import { reactive } from 'vue'
import { useTable } from '@/composables'

// 模拟用户数据
interface User {
    id: number
    name: string
    age: number
    email: string
    address: string
}

// 查询参数类型
interface QueryParams {
    keyword?: string
    minAge?: number
    maxAge?: number
}

// 查询表单
const queryForm = reactive<QueryParams>({
    keyword: '',
    minAge: undefined,
    maxAge: undefined
})

// 模拟后端接口（支持筛选）
const mockFetchUsers = async (params: {
    page: number
    pageSize: number
    keyword?: string
    minAge?: number
    maxAge?: number
}) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    let allUsers: User[] = Array.from({ length: 95 }, (_, i) => ({
        id: i + 1,
        name: `用户 ${i + 1}`,
        age: 20 + (i % 30),
        email: `user${i + 1}@example.com`,
        address: `地址 ${i + 1} 号`
    }))

    // 应用筛选条件
    const { keyword, minAge, maxAge } = params
    if (keyword) {
        allUsers = allUsers.filter(u => u.name.includes(keyword))
    }
    if (minAge !== undefined) {
        allUsers = allUsers.filter(u => u.age >= minAge)
    }
    if (maxAge !== undefined) {
        allUsers = allUsers.filter(u => u.age <= maxAge)
    }

    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize

    return {
        list: allUsers.slice(start, end),
        total: allUsers.length
    }
}

const {
    data,
    loading,
    error,
    pagination,
    search,
    handlePageChange,
    handleSizeChange,
    resetPagination
} = useTable<User>({
    request: mockFetchUsers,
    queryParams: queryForm, // 传入响应式查询参数
    immediate: true,
    defaultPagination: {
        currentPage: 1,
        pageSize: 10
    }
})

// 重置查询
const handleReset = () => {
    queryForm.keyword = ''
    queryForm.minAge = undefined
    queryForm.maxAge = undefined
    resetPagination()
    search()
}
</script>

<template>
    <section class="demo-section">
        <h2>方式1：useTable（自定义 UI）</h2>

        <!-- 查询表单 -->
        <el-form
            :model="queryForm"
            inline
            class="query-form"
        >
            <el-form-item label="关键词">
                <el-input
                    v-model="queryForm.keyword"
                    placeholder="搜索用户名"
                    clearable
                    @keyup.enter="search"
                />
            </el-form-item>
            <el-form-item label="年龄范围">
                <el-input-number
                    v-model="queryForm.minAge"
                    :min="0"
                    :max="100"
                    placeholder="最小"
                    controls-position="right"
                    style="width: 100px"
                />
                <span style="margin: 0 8px">-</span>
                <el-input-number
                    v-model="queryForm.maxAge"
                    :min="0"
                    :max="100"
                    placeholder="最大"
                    controls-position="right"
                    style="width: 100px"
                />
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="search"
                    >查询</el-button
                >
                <el-button @click="handleReset">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 错误提示 -->
        <el-alert
            v-if="error"
            :title="String(error)"
            type="error"
            show-icon
            style="margin-bottom: 16px"
        />

        <!-- 表格 -->
        <el-table
            :data="data"
            v-loading="loading"
            border
        >
            <el-table-column
                prop="id"
                label="ID"
                width="80"
            />
            <el-table-column
                prop="name"
                label="姓名"
                width="120"
            >
                <template #default="{ row }">
                    <el-tag>{{ row.name }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="age"
                label="年龄"
                width="80"
            />
            <el-table-column
                prop="email"
                label="邮箱"
            />
            <el-table-column
                label="操作"
                width="150"
                fixed="right"
            >
                <template #default>
                    <el-button
                        type="primary"
                        size="small"
                        >编辑</el-button
                    >
                    <el-button
                        type="danger"
                        size="small"
                        >删除</el-button
                    >
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
            class="demo-pagination"
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :total="pagination.total"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
        />
    </section>
</template>

<style scoped lang="scss">
.demo-section {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h2 {
        color: #409eff;
        margin-bottom: 16px;
        font-size: 18px;
    }
}

.query-form {
    margin-bottom: 16px;
    padding: 16px;
    background: #f5f7fa;
    border-radius: 4px;
}

.demo-pagination {
    margin-top: 16px;
    justify-content: flex-end;
}
</style>
