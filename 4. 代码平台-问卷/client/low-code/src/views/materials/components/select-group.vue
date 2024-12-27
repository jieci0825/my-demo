<script setup lang="ts">
import Layout from './layout.vue'

const selectLinks = [
    { text: '单选题', to: '/' },
    { text: '多选题', to: '/' },
    { text: '下拉选择', to: '/' },
    { text: '图片单选', to: '/' },
    { text: '图片多选', to: '/' }
]
</script>

<template>
    <div class="select-group-container">
        <Layout>
            <div class="select-wrap flex">
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

<style scoped lang="scss">
.select-group-container {
    width: 100%;
    height: 100%;
    .select-wrap {
        flex-wrap: wrap;
        justify-content: space-between;
    }
}
</style>
