<script setup lang="ts">
import { ref } from 'vue'
import { abcApi } from './api'
import type { Abc } from '@coderjc/types'

const data = ref<Abc.GetAbcListResponseDTO | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchData = async () => {
    loading.value = true
    error.value = null
    try {
        const result = await abcApi.list({
            page: 1,
            pageSize: 10,
        })
        data.value = result
    } catch (err) {
        error.value = err instanceof Error ? err.message : '请求失败'
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="container">
        <h1>web</h1>
        <button @click="fetchData" :disabled="loading">
            {{ loading ? '加载中...' : '获取数据' }}
        </button>
        <div v-if="error" class="error">{{ error }}</div>
        <pre v-if="data">{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
</template>

<style scoped>
.container {
    padding: 20px;
}

h1 {
    margin: 0 0 20px 0;
}

button {
    padding: 8px 16px;
    cursor: pointer;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error {
    margin-top: 16px;
    padding: 12px;
    background: #fee;
    color: #c33;
    border-radius: 4px;
}

pre {
    margin-top: 16px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 4px;
    overflow: auto;
}
</style>
