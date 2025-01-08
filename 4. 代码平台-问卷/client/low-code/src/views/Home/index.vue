<script setup lang="ts">
import { JC_WEN_JUAN_ACTIVE_VIEW } from '@/constants'
import { Plus, Compass } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const tableData = ref([])
const $router = useRouter()

const goToCreateEditor = () => {
    // 当前激活视图是编辑器
    localStorage.setItem(JC_WEN_JUAN_ACTIVE_VIEW, 'editor')
    $router.push(`/editor`)
}
const goToMaterials = () => {
    // 当前激活视图是组件市场
    localStorage.setItem(JC_WEN_JUAN_ACTIVE_VIEW, 'materials')
    $router.push('/materials')
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
                    width="150"
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
