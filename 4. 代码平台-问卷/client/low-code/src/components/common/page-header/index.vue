<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, User, House } from '@element-plus/icons-vue'

const $route = useRoute()
const $router = useRouter()

interface PageHeaderProps {
    title?: string
}
const props = defineProps<PageHeaderProps>()
const innerTitle = computed(() => {
    return props?.title || $route.meta.title
})

const goBack = () => {
    $router.back()
}
const goHome = () => {
    $router.push('/')
}
</script>

<template>
    <div class="page-header flex">
        <div class="page-header-left flex-center">
            <slot name="left">
                <el-button
                    @click="goHome"
                    :icon="House"
                    circle
                ></el-button>
                <el-button
                    @click="goBack"
                    :icon="ArrowLeft"
                    circle
                ></el-button>
            </slot>
        </div>
        <div class="page-header-center flex align-items-center flex-1 pl-20 pr-20">
            <h2 class="font-weight-300">{{ innerTitle }}</h2>
            <div class="center-actions"></div>
        </div>
        <div class="page-header-right flex-center">
            <slot name="right">
                <el-icon :size="20">
                    <User />
                </el-icon>
            </slot>
        </div>
    </div>
</template>

<style scoped lang="scss">
$border-style: 1px solid var(--border-color);

.page-header {
    width: 100%;
    height: 60px;
    border: $border-style;
    .page-header-left,
    .page-header-right {
        width: 100px;
    }
    .page-header-left {
        border-right: $border-style;
    }
    .page-header-right {
        border-left: $border-style;
    }
    .page-header-center {
        .center-actions {
            margin-left: auto;
            padding-left: 20px;
        }
    }
}
</style>
