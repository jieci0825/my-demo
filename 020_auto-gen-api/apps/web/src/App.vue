<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { abcApi } from './api'
import type { Abc } from '@coderjc/types'

const data = ref<Abc.GetAbcListResponseDTO | null>(null)
const loading = ref(false)

const fetchData = async () => {
    loading.value = true
    try {
        const result = await abcApi.list()
        data.value = result
    } catch (error) {
        console.error('请求失败:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchData()
})
</script>

<template>
    <div>
        <a href="https://vite.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
    <div style="margin-top: 20px; padding: 20px; border: 1px solid #ccc; border-radius: 8px">
        <button @click="fetchData" :disabled="loading">
            {{ loading ? '加载中...' : '获取数据' }}
        </button>
        <pre
            v-if="data"
            style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px; overflow: auto"
            >{{ JSON.stringify(data, null, 2) }}</pre
        >
    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
