<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const startExam = () => {
    router.push({
        path: '/exam-paper',
        query: {
            action: 'start',
            id: 1
        }
    })
}
</script>

<template>
    <div class="container">
        <h1>考试记录</h1>
        <el-button
            @click="startExam"
            type="primary"
            >开始考试</el-button
        >
    </div>
</template>

<style scoped lang="scss"></style>
