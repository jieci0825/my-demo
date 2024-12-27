<script setup lang="ts">
import Layout from './layout.vue'

const selectLinks = [
    { text: '手机号', to: '/' },
    { text: '微信号', to: '/' },
    { text: 'QQ号', to: '/' },
    { text: '邮箱', to: '/' },
    { text: '地址', to: '/' }
]
</script>

<template>
    <div class="group-container">
        <Layout>
            <div class="link-wrap flex">
                <router-link
                    v-for="(item, idx) in selectLinks"
                    :key="idx"
                    :to="item.to"
                    class="link-item mb-15"
                    >{{ item.text }}</router-link
                >
            </div>
        </Layout>
    </div>
</template>

<style scoped lang="scss"></style>
