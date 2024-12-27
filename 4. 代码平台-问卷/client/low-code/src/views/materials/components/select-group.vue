<script setup lang="ts">
import Layout from './layout.vue'

const selectLinks = [
    { text: '单选题', to: '/materials/select/single' },
    { text: '多选题', to: '/materials/select/multiple' },
    { text: '下拉选择', to: '/materials/select/option' },
    { text: '图片单选', to: '/materials/select/single-pic' },
    { text: '图片多选', to: '/materials/select/multiple-pic' }
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
                    exact-active-class="link-item-active"
                    class="link-item mb-15"
                    >{{ item.text }}</router-link
                >
            </div>
            <!-- show -->
            <template #center>
                <router-view v-slot="{ Component }">
                    <Component :is="Component" />
                </router-view>
            </template>
            <!-- controller -->
        </Layout>
    </div>
</template>

<style scoped lang="scss"></style>
