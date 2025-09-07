<script setup>
import { useRouter } from 'vue-router'
import { SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()

const logout = () => {
    localStorage.removeItem('token')
    router.push('/login')
}
</script>

<template>
    <div class="layout">
        <el-container>
            <el-header class="header">
                <h1>考试系统后台管理</h1>
                <el-button
                    @click="logout"
                    type="danger"
                    >退出登录</el-button
                >
            </el-header>
            <el-container>
                <el-aside
                    width="200px"
                    class="sidebar"
                >
                    <el-menu
                        default-active="/home"
                        router
                        class="menu"
                    >
                        <el-menu-item index="/home">
                            <span>首页</span>
                        </el-menu-item>
                        <el-sub-menu index="exam-data">
                            <template #title>
                                <span>考试数据</span>
                            </template>
                            <el-menu-item index="/exam-data/paper-manage">考卷管理</el-menu-item>
                            <el-menu-item index="/exam-data/question-manage">问题管理</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="exam-manage">
                            <template #title>
                                <span>考试管理</span>
                            </template>
                            <el-menu-item index="/exam-manage/exam-list">考试记录</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main class="main">
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped lang="scss">
.layout {
    height: 100vh;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #e0e0e0;

    h1 {
        margin: 0;
        font-size: 20px;
    }
}

.sidebar {
    background-color: #f5f5f5;
}

.menu {
    border: none;
    background-color: #f5f5f5;
}

.main {
    background-color: #fff;
    padding: 20px;
}
</style>
