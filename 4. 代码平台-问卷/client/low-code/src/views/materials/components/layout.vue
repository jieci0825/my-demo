<script setup lang="ts"></script>

<template>
    <div class="layout-container flex">
        <!-- 选择业务组件 -->
        <div class="left p-20">
            <slot>选择业务组件</slot>
        </div>
        <!-- 展示业务组件 -->
        <div class="center p-20">
            <slot name="center">展示业务组件</slot>
        </div>
        <!-- 编辑业务组件 -->
        <div class="right p-20">
            <slot name="right">编辑业务组件</slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
.layout-container {
    height: 100%;
    height: 100%;
    overflow: hidden;
    align-items: flex-start;
    border: 1px solid var(--border-color);
    border-top-right-radius: var(--border-radius-large);
    border-bottom-right-radius: var(--border-radius-large);
    border-bottom-left-radius: var(--border-radius-large);
    .left {
        width: 240px;
        height: 100%;
    }
    .center {
        flex: 1;
        height: 100%;
        overflow-y: auto;
        border-left: 1px solid var(--border-color);
    }
    .right {
        width: 350px;
        height: 100%;
        border-left: 1px solid var(--border-color);
    }
}
</style>
