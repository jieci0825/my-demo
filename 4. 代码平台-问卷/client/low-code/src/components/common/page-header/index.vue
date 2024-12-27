<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, User } from '@element-plus/icons-vue'

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
</script>

<template>
    <div class="page-header flex">
        <div class="page-header-left flex-center">
            <slot name="left">
                <el-button
                    @click="goBack"
                    :icon="ArrowLeft"
                    circle
                ></el-button>
            </slot>
        </div>
        <div class="page-header-center flex-center flex-1">
            <h2 class="font-weight-100">{{ innerTitle }}</h2>
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
    height: 50px;
    border: $border-style;
    .page-header-left,
    .page-header-right {
        width: 80px;
    }
    .page-header-left {
        border-right: $border-style;
    }
    .page-header-right {
        border-left: $border-style;
    }
}
</style>
