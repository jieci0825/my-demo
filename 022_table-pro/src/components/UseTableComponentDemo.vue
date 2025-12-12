<script setup lang="ts">
import { useTableComponent } from '@/composables'

// 模拟用户数据
interface User {
    id: number
    name: string
    age: number
    email: string
    address: string
}

// 模拟后端接口
const mockFetchUsers = async (params: { page: number; pageSize: number }) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    const allUsers: User[] = Array.from({ length: 95 }, (_, i) => ({
        id: i + 1,
        name: `用户 ${i + 1}`,
        age: 20 + (i % 30),
        email: `user${i + 1}@example.com`,
        address: `地址 ${i + 1} 号`
    }))

    const start = (params.page - 1) * params.pageSize
    const end = start + params.pageSize

    return {
        list: allUsers.slice(start, end),
        total: allUsers.length
    }
}

const TableComponent = useTableComponent<User>({
    request: mockFetchUsers,
    columns: [
        { prop: 'id', label: 'ID', width: 80 },
        { prop: 'name', label: '姓名', width: 120 },
        { prop: 'age', label: '年龄', width: 80 },
        { prop: 'email', label: '邮箱', minWidth: 200 },
        { prop: 'address', label: '地址', minWidth: 150 }
    ],
    tableProps: {
        border: true,
        stripe: true
    }
})
</script>

<template>
    <section class="demo-section">
        <h2>方式2：useTableComponent（开箱即用）</h2>
        <TableComponent />
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
        margin-bottom: 8px;
        font-size: 18px;
    }
}

:deep(.table-pagination) {
    margin-top: 16px;
    justify-content: flex-end;
}
</style>
