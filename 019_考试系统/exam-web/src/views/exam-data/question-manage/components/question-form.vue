<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { questionApi } from '@/api'
import { QuestionTypeOptions } from '@/config'

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
    sn: '',
    question: '',
    type: '',
    answer: '',
    analysis: '',
    options: [
        { label: 'A', value: '' },
        { label: 'B', value: '' },
        { label: 'C', value: '' },
        { label: 'D', value: '' }
    ]
})

// 表单验证规则
const formRules = {
    sn: [{ required: true, message: '请输入题目序号', trigger: 'blur' }],
    question: [
        { required: true, message: '请输入题目内容', trigger: 'blur' },
        { min: 5, max: 500, message: '题目内容长度应为5-500个字符', trigger: 'blur' }
    ],
    type: [{ required: true, message: '请选择题目类型', trigger: 'change' }],
    answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
}

// 加载状态
const loading = ref(false)

// 计算属性：对话框标题
const dialogTitle = computed(() => {
    return props.mode === 'add' ? '添加问题' : '编辑问题'
})

// 计算属性：是否为选择题
const isChoiceType = computed(() => {
    return formData.value.type === 'choice'
})

// 重置表单
const resetForm = () => {
    formData.value = {
        sn: '',
        question: '',
        type: '',
        answer: '',
        analysis: '',
        options: [
            { label: 'A', value: '' },
            { label: 'B', value: '' },
            { label: 'C', value: '' },
            { label: 'D', value: '' }
        ]
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
                sn: newData.sn || '',
                question: newData.question || '',
                type: newData.type || '',
                answer: newData.answer || '',
                analysis: newData.analysis || '',
                options:
                    newData.options && newData.options.length > 0
                        ? newData.options
                        : [
                              { label: 'A', value: '' },
                              { label: 'B', value: '' },
                              { label: 'C', value: '' },
                              { label: 'D', value: '' }
                          ]
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

// 监听题目类型变化
watch(
    () => formData.value.type,
    newType => {
        if (newType !== 'choice') {
            // 非选择题时清空选项
            formData.value.options = [
                { label: 'A', value: '' },
                { label: 'B', value: '' },
                { label: 'C', value: '' },
                { label: 'D', value: '' }
            ]
        }
    }
)

// 添加选项
const addOption = () => {
    const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    const nextLabel = labels[formData.value.options.length]
    if (nextLabel) {
        formData.value.options.push({ label: nextLabel, value: '' })
    }
}

// 删除选项
const removeOption = index => {
    if (formData.value.options.length > 2) {
        formData.value.options.splice(index, 1)
        // 重新排序标签
        const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
        formData.value.options.forEach((option, idx) => {
            option.label = labels[idx]
        })
    }
}

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

        // 验证选择题选项
        if (isChoiceType.value) {
            const validOptions = formData.value.options.filter(option => option.value.trim())
            if (validOptions.length < 2) {
                ElMessage.error('选择题至少需要2个选项')
                return
            }
        }

        loading.value = true

        const submitData = {
            sn: formData.value.sn,
            question: formData.value.question,
            type: formData.value.type,
            answer: formData.value.answer,
            analysis: formData.value.analysis || undefined
        }

        // 只有选择题才包含选项
        if (isChoiceType.value) {
            submitData.options = formData.value.options.filter(option => option.value.trim())
        }

        if (props.mode === 'add') {
            await questionApi.createQuestion({ questions: [submitData] })
            ElMessage.success('添加问题成功')
        } else {
            await questionApi.updateQuestionById(props.editData.id, submitData)
            ElMessage.success('更新问题成功')
        }

        emit('success')
        handleClose()
    } catch (error) {
        ElMessage.error(props.mode === 'add' ? '添加问题失败' : '更新问题失败')
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
        width="600px"
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
                label="题目序号"
                prop="sn"
            >
                <el-input
                    v-model="formData.sn"
                    placeholder="请输入题目序号"
                />
            </el-form-item>

            <el-form-item
                label="题目内容"
                prop="question"
            >
                <el-input
                    v-model="formData.question"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入题目内容"
                    maxlength="500"
                    show-word-limit
                />
            </el-form-item>

            <el-form-item
                label="题目类型"
                prop="type"
            >
                <el-select
                    v-model="formData.type"
                    placeholder="请选择题目类型"
                    style="width: 100%"
                >
                    <el-option
                        v-for="item in QuestionTypeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>

            <!-- 选择题选项配置 -->
            <el-form-item
                v-if="isChoiceType"
                label="题目选项"
                required
            >
                <div class="options-container">
                    <div
                        v-for="(option, index) in formData.options"
                        :key="index"
                        class="option-item"
                    >
                        <span class="option-label">{{ option.label }}:</span>
                        <el-input
                            v-model="option.value"
                            placeholder="请输入选项内容"
                            class="option-input"
                        />
                        <el-button
                            v-if="formData.options.length > 2"
                            type="danger"
                            size="small"
                            text
                            @click="removeOption(index)"
                        >
                            删除
                        </el-button>
                    </div>
                    <el-button
                        v-if="formData.options.length < 8"
                        type="primary"
                        size="small"
                        text
                        @click="addOption"
                    >
                        + 添加选项
                    </el-button>
                </div>
            </el-form-item>

            <el-form-item
                label="正确答案"
                prop="answer"
            >
                <el-input
                    v-model="formData.answer"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入正确答案"
                />
            </el-form-item>

            <el-form-item
                label="答案解析"
                prop="analysis"
            >
                <el-input
                    v-model="formData.analysis"
                    type="textarea"
                    :rows="3"
                    placeholder="请输入答案解析（可选）"
                    maxlength="300"
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

.options-container {
    width: 100%;

    .option-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .option-label {
            min-width: 30px;
            font-weight: 500;
            color: #606266;
        }

        .option-input {
            flex: 1;
            margin: 0 8px;
        }
    }
}
</style>
