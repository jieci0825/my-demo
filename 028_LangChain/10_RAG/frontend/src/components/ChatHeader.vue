<script setup>
import { ref } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineProps({
    currentDoc: {
        type: String,
        default: '',
    },
})

const emit = defineEmits(['upload-success'])
const fileInput = ref(null)

const triggerUpload = () => {
    fileInput.value.click()
}

const handleFileChange = async event => {
    const file = event.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
        const response = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: formData,
        })

        const result = await response.json()

        if (result.success) {
            ElMessage.success('文件上传成功')
            emit('upload-success', result.data.originalName)
        } else {
            ElMessage.error(result.error || '上传失败')
        }
    } catch (error) {
        console.error('Upload error:', error)
        ElMessage.error('网络错误，上传失败')
    } finally {
        // 重置 input 以允许再次上传同名文件
        event.target.value = ''
    }
}
</script>

<template>
    <header class="chat-header">
        <div class="title">AI Chat (RAG Test)</div>
        <div class="status" v-if="currentDoc">
            当前挂载文档：<span class="doc-name">{{ currentDoc }}</span>
        </div>
        <div class="actions">
            <input
                type="file"
                ref="fileInput"
                style="display: none"
                @change="handleFileChange"
            />
            <el-button type="primary" :icon="Upload" @click="triggerUpload">
                上传文件
            </el-button>
        </div>
    </header>
</template>

<style scoped lang="scss">
.chat-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    background-color: var(--sub-bg-color);
    border-bottom: 1px solid var(--border-color);

    .title {
        font-size: 1.2rem;
        font-weight: bold;
        color: var(--active-text-color);
    }

    .status {
        font-size: 0.9rem;
        color: var(--text-color);

        .doc-name {
            color: var(--active-text-color);
            text-decoration: underline;
        }
    }
}
</style>
