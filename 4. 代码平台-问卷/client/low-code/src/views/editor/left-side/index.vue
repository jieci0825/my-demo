<script setup lang="ts">
import { Document, Memo } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const tabList = [
    { text: '题型', routeName: 'editor-survey-type', icon: Memo },
    { text: '大纲', routeName: 'editor-outline', icon: Document }
]

const $route = useRoute()
const $router = useRouter()
</script>

<template>
    <div class="left-side-container flex">
        <div class="tabs">
            <div
                v-for="(tab, idx) in tabList"
                :key="idx"
                :class="['tab-item', { 'tab-item-active': $route.name === tab.routeName }]"
                @click="$router.push({ name: tab.routeName })"
            >
                <el-icon :size="25">
                    <component :is="tab.icon"></component>
                </el-icon>
                <span class="mt-5">{{ tab.text }}</span>
            </div>
        </div>
        <div class="flex-1 tab-content">
            <RouterView></RouterView>
        </div>
    </div>
</template>

<style scoped lang="scss">
.tab-item-active {
    color: var(--primary-color);
    background-color: var(--el-color-primary-light-9);
}

.left-side-container {
    width: 350px;
    height: 100%;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-base);
    overflow: hidden;
    .tabs {
        flex-shrink: 0;
        width: 80px;
        height: 100%;
        border-right: 1px solid var(--border-color);
        .tab-item {
            cursor: pointer;
            display: flex;
            align-items: center;
            flex-direction: column;
            padding: 15px 0;
            transition: background-color 0.25s, color 0.25s;
            font-size: 13px;
            &:hover {
                @extend .tab-item-active;
            }
            &.active {
                @extend .tab-item-active;
            }
        }
    }
    .tab-content {
        overflow: hidden;
    }
}
</style>
