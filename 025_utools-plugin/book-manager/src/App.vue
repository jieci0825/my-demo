<script setup>
import { useInit, useSubInput } from './hooks'
import { provide } from 'vue'

const { bookmarks } = useInit()

const {
    value: keyword,
    setSubInput,
    onChanged,
    onSearch,
    onClear
} = useSubInput()

provide('appContext', {
    bookmarks,
    keyword,
    setSubInput,
    onChanged,
    onSearch,
    onClear
})
</script>

<template></template>

<style lang="scss"></style>
