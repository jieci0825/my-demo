<script setup>
import Home from './views/home/index.vue'
import { useInit, useSubInput } from './hooks'
import { provide, watch } from 'vue'

const { bookmarks, initialKeyword } = useInit()

const {
    value: keyword,
    setSubInput,
    onChanged,
    onSearch,
    onClear
} = useSubInput()

// 监听初始关键词变化，设置到子输入框
watch(
    initialKeyword,
    newKeyword => {
        if (newKeyword) {
            setSubInput(newKeyword)
        }
    },
    { immediate: true }
)

provide('appContext', {
    bookmarks,
    keyword,
    setSubInput,
    onChanged,
    onSearch,
    onClear
})
</script>

<template>
    <Home />
</template>
