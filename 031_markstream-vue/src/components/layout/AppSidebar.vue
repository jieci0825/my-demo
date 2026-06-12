<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { menuRoutes } from '../../router'
import AppBrand from './AppBrand.vue'

defineProps<{
    open: boolean
}>()

defineEmits<{
    close: []
}>()
</script>

<template>
    <aside class="sidebar" :class="{ 'is-open': open }">
        <AppBrand class="sidebar-brand" />

        <div class="navigation-label">渲染配置</div>
        <nav class="navigation" aria-label="渲染配置">
            <RouterLink
                v-for="item in menuRoutes"
                :key="item.path"
                :to="item.path"
                class="navigation-item"
                @click="$emit('close')"
            >
                {{ item.meta?.title }}
            </RouterLink>
        </nav>

        <div class="sidebar-footer">
            <span class="status-dot" />
            markstream-vue 1.0.0
        </div>
    </aside>

    <button
        v-if="open"
        class="sidebar-mask"
        type="button"
        aria-label="关闭导航"
        @click="$emit('close')"
    />
</template>

<style scoped lang="scss">
.sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 20;
    display: flex;
    width: 264px;
    flex-direction: column;
    padding: 30px 20px 22px;
    border-right: 1px solid #dddfda;
    background: #f8f9f6;

    .sidebar-brand {
        padding: 0 8px 32px;
    }

    .navigation-label {
        padding: 0 10px 10px;
        color: #a0a59f;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
    }

    .navigation {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .navigation-item {
            display: flex;
            min-height: 44px;
            align-items: center;
            padding: 10px 12px;
            border-radius: 8px;
            color: #687069;
            font-size: 13px;
            font-weight: 600;
            text-decoration: none;
            transition: color 160ms ease, background-color 160ms ease;
        }

        .navigation-item:hover {
            color: #2e352f;
            background: #eceee9;
        }

        .navigation-item.router-link-active {
            color: #205a3d;
            background: #e2ebe4;
        }
    }

    .sidebar-footer {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: auto;
        padding: 0 10px;
        color: #949a95;
        font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
        font-size: 10px;

        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #4f9b70;
            box-shadow: 0 0 0 3px #e2eee6;
        }
    }
}

.sidebar-mask {
    display: none;
}

@media (max-width: 900px) {
    .sidebar {
        width: min(82vw, 286px);
        transform: translateX(-100%);
        transition: transform 180ms ease;
    }

    .sidebar.is-open {
        transform: translateX(0);
    }

    .sidebar-mask {
        position: fixed;
        inset: 0;
        z-index: 19;
        display: block;
        border: 0;
        background: rgb(20 24 21 / 36%);
    }
}
</style>
