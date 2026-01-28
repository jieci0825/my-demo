<script setup>
import { ref } from 'vue'
import ChatHeader from './components/ChatHeader.vue'
import ChatMessages from './components/ChatMessages.vue'
import ChatInput from './components/ChatInput.vue'

const currentDoc = ref('')
const messages = ref([])

const handleUploadSuccess = docName => {
    currentDoc.value = docName
}

const handleSendMessage = async text => {
    // 获取当前对话历史（排除系统欢迎语）
    const history = messages.value.slice(1)

    messages.value.push({ role: 'user', content: text })

    // 添加空的 AI 消息占位，用于流式填充
    messages.value.push({ role: 'ai', content: '' })
    // 从数组中获取 reactive 化后的对象引用，确保修改能触发视图更新
    const aiMessage = messages.value[messages.value.length - 1]

    try {
        const response = await fetch('http://localhost:3002/api/chat', {
            method: 'POST',
            body: JSON.stringify({ prompt: text, history }),
        })

        if (!response.ok) {
            aiMessage.content = '请求失败，请稍后重试。'
            return
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })

            // 解析 SSE 格式数据
            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
                const trimmedLine = line.trim()
                if (!trimmedLine || !trimmedLine.startsWith('data:')) continue

                const data = trimmedLine.slice(5).trim()
                if (data === '[DONE]') continue

                try {
                    const parsed = JSON.parse(data)
                    if (parsed.content) {
                        aiMessage.content += parsed.content
                    }
                    if (parsed.error) {
                        aiMessage.content = parsed.error
                    }
                } catch {}
            }
        }

        if (!aiMessage.content) {
            aiMessage.content = '未收到有效响应。'
        }
    } catch (error) {
        aiMessage.content = '网络错误，请检查连接。'
    }
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
