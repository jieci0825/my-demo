<script setup>
import { ref, onMounted } from 'vue'

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

onMounted(() => {
    // 默认保持浅色模式
    document.documentElement.classList.remove('dark')
})
</script>

<template></template>

<style lang="scss"></style>
