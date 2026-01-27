<script setup>
import { ref } from 'vue'
import ChatHeader from './components/ChatHeader.vue'
import ChatMessages from './components/ChatMessages.vue'
import ChatInput from './components/ChatInput.vue'

const currentDoc = ref('')
const messages = ref([
    {
        role: 'ai',
        content:
            '你好！我是你的 AI 助手。你可以上传文档，然后针对文档内容向我提问。',
    },
])

const handleUploadSuccess = docName => {
    currentDoc.value = docName
    messages.value.push({
        role: 'ai',
        content: `成功挂载文档：${docName}。现在你可以开始提问了。`,
    })
}

const handleSendMessage = async text => {
    // 添加用户消息
    messages.value.push({ role: 'user', content: text })

    // 发送请求
    const response = await fetch('http://localhost:3002/api/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: text }),
    })
    const data = await response.json()
    console.log(data)

    messages.value.push({ role: 'ai', content: data.answer })

    // 模拟 AI 回复
    // 注意：这里后续需要对接真实的 RAG 接口
    // setTimeout(() => {
    //     const reply = currentDoc.value
    //         ? `针对文档《${currentDoc.value}》，你问的是："${text}"。由于目前是 UI 测试阶段，暂未对接真实 RAG 后端。`
    //         : `你问的是："${text}"。请先上传文档以开启 RAG 测试。`

    //     messages.value.push({ role: 'ai', content: reply })
    // }, 1000)
}
</script>

<template>
    <div class="chat-container">
        <ChatHeader
            :current-doc="currentDoc"
            @upload-success="handleUploadSuccess"
        />
        <ChatMessages :messages="messages" />
        <ChatInput @send="handleSendMessage" />
    </div>
</template>

<style scoped lang="scss">
.chat-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    background-color: var(--bg-color);
}
</style>
