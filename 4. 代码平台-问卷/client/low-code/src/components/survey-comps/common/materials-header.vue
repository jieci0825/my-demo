<script setup lang="ts"></script>

<template>
    <div class="materials-header mb-15">
        <h2 class="title font-weight-100">这是一个标题</h2>
        <div class="description">这是一个描述</div>
    </div>
</template>

<style scoped lang="scss">
.materials-header {
    h2 {
        font-size: 20px;
    }
    .description {
        font-size: var(--font-size-base);
        color: var(--font-color-light);
        text-indent: 5px;
    }
}
</style>
