<script setup>
import { getCurrentInstance, ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import { renderDialog } from './utils/renderDialog'

const dialogFormVisible = ref(false)

const loginFormRef = ref()

const open = () => {
    // dialogFormVisible.value = true

    const { unmount, instance } = renderDialog(LoginForm, {}, { title: '登录表单' })
}
</script>

<template>
    <div class="container">
        <div>
            <el-button
                type="primary"
                @click="open"
                >打开</el-button
            >
        </div>
        <el-dialog
            v-model="dialogFormVisible"
            title="登录表单"
            width="500"
        >
            <LoginForm ref="loginFormRef" />
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
