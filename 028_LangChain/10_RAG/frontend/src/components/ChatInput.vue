<script setup>
import { ref } from 'vue'

const emit = defineEmits(['send'])
const inputText = ref('')

const handleSend = () => {
    if (!inputText.value.trim()) return
    emit('send', inputText.value)
    inputText.value = ''
}
</script>

<template>
    <footer class="chat-input">
        <el-input
            v-model="inputText"
            placeholder="输入问题，按回车发送..."
            @keyup.enter="handleSend"
            clearable
        >
            <template #append>
                <el-button @click="handleSend">发送</el-button>
            </template>
        </el-input>
    </footer>
</template>

<style scoped lang="scss">
.chat-input {
    padding: 20px;
    background-color: var(--sub-bg-color);
    border-top: 1px solid var(--border-color);

    :deep(.el-input-group__append) {
        background-color: var(--active-bg-color);
        color: var(--active-text-color);
        border: none;
        cursor: pointer;
        
        &:hover {
            background-color: var(--active-text-color);
            color: var(--text-color);
        }
    }

    :deep(.el-input__wrapper) {
        background-color: var(--bg-dark-color);
        box-shadow: none !important;
        border: 1px solid var(--border-color);
        
        &.is-focus {
            border-color: var(--active-text-color);
        }
    }

    :deep(.el-input__inner) {
        color: var(--text-color);
        height: 40px;
    }
}
</style>

