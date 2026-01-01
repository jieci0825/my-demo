<script setup>
import Home from './views/home/index.vue'
import { useInit, useSubInput } from './hooks'
import { provide, watch } from 'vue'
import { getBookmarks } from '@/utils'

const { bookmarks, initialKeyword } = useInit()

// 刷新书签数据
const refreshBookmarks = () => {
    const newBookmarks = getBookmarks(true)
    if (newBookmarks && newBookmarks.length > 0) {
        bookmarks.value = newBookmarks
        return true
    }
    return false
}

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
    onClear,
    refreshBookmarks
})
</script>

<template>
    <Home />
</template>
