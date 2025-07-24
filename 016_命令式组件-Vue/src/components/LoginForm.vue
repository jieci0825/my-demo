<script setup>
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const ruleFormRef = ref()

const ruleForm = ref({
    username: '',
    password: ''
})

const rules = {
    username: [{ required: true, message: '不能为空', trigger: 'blur' }],
    password: [{ required: true, message: '不能为空', trigger: 'blur' }]
}

const submitForm = async () => {
    const formEl = ruleFormRef.value
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            ElMessage.success('提交成功')
        } else {
            ElMessage.error('提交失败')
        }
    })
}

defineExpose({
    submitForm
})
</script>

<template>
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
    >
        <el-form-item
            label="用户名"
            prop="username"
        >
            <el-input v-model="ruleForm.username" />
        </el-form-item>
        <el-form-item
            label="密码"
            prop="password"
        >
            <el-input
                type="password"
                show-password
                v-model="ruleForm.password"
            />
        </el-form-item>
    </el-form>
</template>

<style scoped lang="scss"></style>
