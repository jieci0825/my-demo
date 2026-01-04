<script setup>
import Home from './views/home/index.vue'
import { useInit, useSubInput, useTheme, useSettingsManager } from './hooks'
import { provide } from 'vue'
import { getBookmarks } from '@/utils'

const { setTheme } = useTheme()
const settingsManager = useSettingsManager()

const {
    value: keyword,
    register,
    unregister,
    setSubInput,
    onChanged,
    onSearch,
    onClear
} = useSubInput()

const { bookmarks } = useInit({
    onEnter: keyword => register(keyword)
})

// 刷新书签数据
const refreshBookmarks = () => {
    const newBookmarks = getBookmarks(true)
    if (newBookmarks && newBookmarks.length > 0) {
        bookmarks.value = newBookmarks
        return true
    }
    return false
}

// 主题变更
settingsManager.on('theme', changes => {
    const themeChange = changes.find(c => c.key === 'theme')
    if (themeChange) {
        setTheme(themeChange.newValue)
    }
})

// 书签路径变更
settingsManager.on(['chromePath', 'edgePath'], () => {
    refreshBookmarks()
})

provide('appContext', {
    bookmarks,
    keyword,
    setSubInput,
    unregister,
    onChanged,
    onSearch,
    onClear
})
</script>

<template>
    <Home />
</template>
