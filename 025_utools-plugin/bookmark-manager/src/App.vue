<script setup>
import Home from './views/home/index.vue'
import { useInit, useSubInput, useTheme, useSettingsManager } from './hooks'
import { provide, watch } from 'vue'
import { getBookmarks } from '@/utils'

const { bookmarks, initialKeyword } = useInit()
const { setTheme } = useTheme()
const settingsManager = useSettingsManager()

// 刷新书签数据
const refreshBookmarks = () => {
    const newBookmarks = getBookmarks(true)
    if (newBookmarks && newBookmarks.length > 0) {
        bookmarks.value = newBookmarks
        return true
    }
    return false
}

// 注册配置变更回调
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
