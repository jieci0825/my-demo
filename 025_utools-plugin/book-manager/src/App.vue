<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from './hooks'

const route = ref('')
const enterAction = ref({})

// 检查是否在 utools 环境中
if (window.utools) {
    window.utools.onPluginEnter(action => {
        route.value = action.code
        enterAction.value = action
        window.utools.setSubInput(({ text }) => {
            console.log('text: ', text)
        }, '搜索书籍...')
    })
    window.utools.onPluginOut(isKill => {
        route.value = ''
    })
} else {
    console.warn('非 utools 环境，使用开发模式')
    route.value = 'hello'
    enterAction.value = { code: 'hello' }
}

const { isDark, toggleTheme } = useTheme()
</script>

<template>
    <button @click="toggleTheme">切换主题</button>

    <div v-if="isDark">暗色模式</div>
    <div v-else>浅色模式</div>
</template>

<style lang="scss"></style>
