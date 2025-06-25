<script setup>
import fs from 'fs'
import { ipcRenderer } from 'electron'

console.log(fs.readFileSync)
console.log('============')
console.log(ipcRenderer)
</script>

<template>
    <div class="container">
        <h1>hello vite & Electron</h1>
    </div>
</template>

<style scoped lang="scss"></style>
