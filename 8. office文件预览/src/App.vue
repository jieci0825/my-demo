<script setup>
import { computed, onMounted, ref } from 'vue'
import { renderAsync } from 'docx-preview'

const fileInput = ref(null)
const filename = ref('')
const fileType = computed(() => {
    return filename.value.split('.').pop()
})
const previewBox = ref(null)

// 处理本地的 docx 文件
const handleDocx = async file => {
    // 将文件转为 blob 数据
    const blob = new Blob([file], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
    renderAsync(blob, previewBox.value)
}

// 预览在线的 docx 文件
const previewOnlineDocx = async () => {
    const filename = encodeURIComponent('获取 AppID')
    const cosFileUrl = `https://coderjcnodejs-1312270807.cos.ap-guangzhou.myqcloud.com/${filename}.docx`

    const response = await fetch(cosFileUrl)
    const blob = await response.blob()
    renderAsync(blob, previewBox.value)
}

const processFile = e => {
    const file = e.target.files[0]
    filename.value = file.name
    switch (fileType.value) {
        case 'docx':
            handleDocx(file)
            break
    }
}

onMounted(() => {
    fileInput.value.addEventListener('change', processFile)
})
</script>

<template>
    <div class="container">
        <div class="header">
            <input
                type="file"
                ref="fileInput"
            />
            <button @click="previewOnlineDocx">预览在线的docx</button>
        </div>
        <div
            class="preview-box"
            ref="previewBox"
        ></div>
    </div>
</template>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    padding: 20px;
    .header {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 20px;
        height: 50px;
        background-color: #ccc;
        flex-shrink: 0;
    }

    .preview-box {
        flex: 1;
        width: 100%;
        border: 1px solid #ccc;
        overflow: hidden auto;
    }
}
</style>
