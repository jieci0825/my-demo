<script setup lang="ts">
import UseTableDemo from './components/UseTableDemo.vue'
import UseTableComponentDemo from './components/UseTableComponentDemo.vue'
</script>

<template>
    <div class="demo-container">
        <h1>useTable & useTableComponent 演示</h1>

        <!-- 方式1：useTable 自定义 UI -->
        <UseTableDemo />

        <!-- 方式2：useTableComponent 开箱即用 -->
        <!-- <UseTableComponentDemo /> -->
    </div>
</template>

<style scoped lang="scss">
.demo-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;

    h1 {
        text-align: center;
        color: #303133;
        margin-bottom: 32px;
    }
}
</style>
