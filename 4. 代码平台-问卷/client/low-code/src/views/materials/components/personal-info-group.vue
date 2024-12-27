<script setup lang="ts">
import Layout from './layout.vue'

const selectLinks = [
    { text: '姓名', to: '/' },
    { text: '身份证', to: '/' },
    { text: '出生日期', to: '/' },
    { text: '性别', to: '/' },
    { text: '年龄', to: '/' },
    { text: '学历', to: '/' },
    { text: '大学', to: '/' },
    { text: '专业', to: '/' },
    { text: '行业', to: '/' },
    { text: '职业', to: '/' },
    { text: '公司', to: '/' },
    { text: '职位', to: '/' }
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
