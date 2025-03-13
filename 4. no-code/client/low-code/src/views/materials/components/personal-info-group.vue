<script setup lang="ts">
import Layout from './layout.vue'

const selectLinks = [
    { text: '姓名', to: '/materials/personal-info/name' },
    { text: '身份证', to: '/materials/personal-info/id' },
    { text: '出生日期', to: '/materials/personal-info/birth' },
    { text: '性别', to: '/materials/personal-info/gender' },
    { text: '年龄', to: '/materials/personal-info/age' },
    { text: '学历', to: '/materials/personal-info/education' },
    { text: '大学', to: '/materials/personal-info/collage' },
    { text: '专业', to: '/materials/personal-info/major' },
    { text: '行业', to: '/materials/personal-info/industry' },
    { text: '职业', to: '/materials/personal-info/career' },
    { text: '公司', to: '/materials/personal-info/company' },
    { text: '职位', to: '/materials/personal-info/position' }
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
