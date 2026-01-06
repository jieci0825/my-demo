<script setup lang="ts">
import { Icon } from '@iconify/vue'
import loginVariant from '@iconify-icons/mdi/login-variant'
</script>

<template>
  <div class="page">
    <MyButton variant="primary">主要按钮</MyButton>
    <MyButton variant="secondary">次要按钮</MyButton>
    <MyButton variant="danger">危险按钮</MyButton>
    <MyButton variant="outline">轮廓按钮</MyButton>
    <MyButton variant="ghost">幽灵按钮</MyButton>
    <MyButton variant="link">链接按钮</MyButton>

    <MyButton variant="primary">
      <template #icon>
        <Icon :icon="loginVariant" />
      </template>
    </MyButton>

    <MyButton variant="primary">
      <template #icon>
        <Icon :icon="loginVariant" />
      </template>
      带图标按钮
    </MyButton>

    <MyButton variant="primary" loading>加载中按钮</MyButton>

    <MyButton as-child>
      <a href="/login">Login</a>
    </MyButton>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
}
</style>
