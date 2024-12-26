<script setup lang="ts">
import { Plus, Compass } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const tableData = ref([])
const router = useRouter()

const goToEditor = () => {
    router.push('/editor')
}
const goToMaterials = () => {
    router.push('/materials')
}
</script>

<template>
    <div class="home-container flex flex-direction-column align-items-center">
        <!-- 标题 -->
        <h1 class="title font-weight-100 mt-30">JC问卷系统</h1>
        <!-- main -->
        <div class="main mt-20">
            <!-- 按钮组 -->
            <div class="actions mb-10">
                <el-button
                    @click="goToEditor"
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
                    width="150"
                />
                <el-table-column
                    prop="title"
                    label="问卷标题"
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
                    width="150"
                    align="center"
                />
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="300"
                    align="center"
                >
                    <template>
                        <el-button
                            type="primary"
                            size="small"
                            plain
                            >查看问卷</el-button
                        >
                        <el-button
                            type="primary"
                            size="small"
                            plain
                            >编辑</el-button
                        >
                        <el-button
                            type="danger"
                            size="small"
                            plain
                            >删除</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<style scoped lang="scss">
.home-container {
    .main {
        width: var(--center-width);
    }
}
</style>
