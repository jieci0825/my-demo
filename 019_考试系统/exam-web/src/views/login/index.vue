<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { authApi } from '@/api'

const router = useRouter()

// 登录表单数据
const loginForm = reactive({
    username: '',
    password: ''
})

// 表单验证规则
const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
    ]
}

// 加载状态
const loading = ref(false)
const loginFormRef = ref()

// 登录方法
const handleLogin = async () => {
    try {
        // 表单验证
        await loginFormRef.value.validate()

        loading.value = true

        // 调用登录API
        const response = await authApi.login(loginForm)

        // 保存token
        localStorage.setItem('token', response.data.token)

        ElMessage.success('登录成功')

        // 跳转到首页
        router.push('/')
    } catch (error) {
        console.error('登录错误:', error)
        ElMessage.error(error.message || '登录失败，请重试')
    } finally {
        loading.value = false
    }
}

// 回车登录
const handleKeyup = event => {
    if (event.key === 'Enter') {
        handleLogin()
    }
}
</script>

<template>
    <div class="login-container">
        <div class="login-form-wrapper">
            <div class="login-header">
                <h1>考试系统</h1>
                <p>欢迎登录后台管理系统</p>
            </div>

            <el-form
                ref="loginFormRef"
                :model="loginForm"
                :rules="rules"
                class="login-form"
                @keyup="handleKeyup"
            >
                <el-form-item prop="username">
                    <el-input
                        v-model="loginForm.username"
                        placeholder="请输入用户名"
                        size="large"
                        clearable
                    >
                        <template #prefix>
                            <el-icon><User /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="password">
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        placeholder="请输入密码"
                        size="large"
                        show-password
                        clearable
                    >
                        <template #prefix>
                            <el-icon><Lock /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button
                        type="primary"
                        size="large"
                        class="login-btn"
                        :loading="loading"
                        @click="handleLogin"
                    >
                        {{ loading ? '登录中...' : '登录' }}
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped lang="scss">
.login-container {
    height: 100vh;
    background: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-form-wrapper {
    background: white;
    padding: 40px;
    border-radius: 12px;
    width: 400px;
    border: 1px solid #e0e0e0;
    max-width: 90vw;
}

.login-header {
    text-align: center;
    margin-bottom: 30px;

    h1 {
        color: #333;
        margin: 0 0 10px 0;
        font-size: 28px;
        font-weight: 600;
    }

    p {
        color: #666;
        margin: 0;
        font-size: 14px;
    }
}

.login-form {
    .el-form-item {
        margin-bottom: 24px;
    }

    .login-btn {
        width: 100%;
        height: 44px;
        font-size: 16px;
        border-radius: 6px;
    }
}

:deep(.el-input__wrapper) {
    border-radius: 6px;
}
</style>
