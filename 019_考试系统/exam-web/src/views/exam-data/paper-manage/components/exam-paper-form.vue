<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { examPaperApi } from '@/api'

// Props
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    editData: {
        type: Object,
        default: null
    },
    mode: {
        type: String,
        default: 'add', // 'add' 或 'edit'
        validator: value => ['add', 'edit'].includes(value)
    }
})

// Emits
const emit = defineEmits(['update:visible', 'success'])

// 表单引用
const formRef = ref(null)

// 表单数据
const formData = ref({
    name: '',
    category: ''
})

// 表单验证规则
const formRules = {
    name: [
        { required: true, message: '请输入考卷名称', trigger: 'blur' },
        { min: 2, max: 50, message: '考卷名称长度应为2-50个字符', trigger: 'blur' }
    ],
    category: [{ required: true, message: '请输入考卷分类', trigger: 'blur' }]
}

// 加载状态
const loading = ref(false)

// 计算属性：对话框标题
const dialogTitle = computed(() => {
    return props.mode === 'add' ? '添加考卷' : '编辑考卷'
})

// 重置表单
const resetForm = () => {
    formData.value = {
        name: '',
        category: ''
    }
    nextTick(() => {
        formRef.value?.clearValidate()
    })
}

// 监听编辑数据变化
watch(
    () => props.editData,
    newData => {
        if (newData && props.mode === 'edit') {
            formData.value = {
                name: newData.name || '',
                category: newData.category || ''
            }
        }
    },
    { deep: true, immediate: true }
)

// 监听对话框显示状态
watch(
    () => props.visible,
    newVisible => {
        if (newVisible && props.mode === 'add') {
            resetForm()
        }
    }
)

// 关闭对话框
const handleClose = () => {
    emit('update:visible', false)
    resetForm()
}

// 提交表单
const handleSubmit = async () => {
    try {
        const valid = await formRef.value.validate()
        if (!valid) return

        loading.value = true

        if (props.mode === 'add') {
            await examPaperApi.createExamPaper(formData.value)
            ElMessage.success('添加考卷成功')
        } else {
            await examPaperApi.updateExamPaperById(props.editData.id, formData.value)
            ElMessage.success('更新考卷成功')
        }

        emit('success')
        handleClose()
    } catch (error) {
        ElMessage.error(props.mode === 'add' ? '添加考卷失败' : '更新考卷失败')
    } finally {
        loading.value = false
    }
}

// 取消操作
const handleCancel = () => {
    handleClose()
}
</script>

<template>
    <el-dialog
        :model-value="visible"
        :title="dialogTitle"
        width="500px"
        :before-close="handleClose"
        destroy-on-close
    >
        <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="100px"
            label-position="right"
        >
            <el-form-item
                label="考卷名称"
                prop="name"
            >
                <el-input
                    v-model="formData.name"
                    placeholder="请输入考卷名称"
                    maxlength="50"
                    show-word-limit
                />
            </el-form-item>

            <el-form-item
                label="考卷分类"
                prop="category"
            >
                <el-input
                    v-model="formData.category"
                    placeholder="请输入考卷分类"
                    maxlength="20"
                    show-word-limit
                />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCancel">取消</el-button>
                <el-button
                    type="primary"
                    @click="handleSubmit"
                    :loading="loading"
                >
                    {{ mode === 'add' ? '添加' : '更新' }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped lang="scss">
.dialog-footer {
    text-align: right;
}

:deep(.el-form-item__label) {
    font-weight: 500;
}
</style>
