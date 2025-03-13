<script setup lang="ts">
import Layout from './layout.vue'

const selectLinks = [
    { text: '评价/打分', to: '/materials/advanced/rate-score' },
    { text: '日期时间', to: '/materials/advanced/date-time' }
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
