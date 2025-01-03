<script setup lang="ts">
import Layout from './layout.vue'

const selectLinks = [
    { text: '手机号', to: '/materials/contact/phone' },
    { text: '微信号', to: '/materials/contact/wechat' },
    { text: 'QQ号', to: '/materials/contact/qq' },
    { text: '邮箱', to: '/materials/contact/email' },
    { text: '地址', to: '/materials/contact/address' }
]
</script>

<template>
    <div class="group-container">
        <Layout>
            <div class="link-wrap flex">
                <router-link
                    exact-active-class="link-item-active"
                    class="link-item mb-15"
                    v-for="(item, idx) in selectLinks"
                    :key="idx"
                    :to="item.to"
                    >{{ item.text }}</router-link
                >
            </div>
        </Layout>
    </div>
</template>

<style scoped lang="scss"></style>
