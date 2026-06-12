<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import { demoRoutes } from './router'

const route = useRoute()
const isNavigationOpen = ref(false)

const currentRoute = computed(() => {
    return demoRoutes.find(item => item.path === route.path) ?? demoRoutes[0]
})

function closeNavigation() {
    isNavigationOpen.value = false
}
</script>

<template>
    <div class="app-shell">
        <header class="mobile-header">
            <div>
                <span class="brand-mark">M</span>
                <strong>Markstream Lab</strong>
            </div>
            <button
                class="menu-button"
                type="button"
                aria-label="切换导航"
                :aria-expanded="isNavigationOpen"
                @click="isNavigationOpen = !isNavigationOpen"
            >
                <span />
                <span />
                <span />
            </button>
        </header>

        <aside class="sidebar" :class="{ 'is-open': isNavigationOpen }">
            <div class="brand">
                <span class="brand-mark">M</span>
                <div>
                    <strong>Markstream Lab</strong>
                    <small>Vue renderer playground</small>
                </div>
            </div>

            <div class="navigation-label">渲染配置</div>
            <nav class="navigation" aria-label="渲染配置">
                <RouterLink
                    v-for="item in demoRoutes"
                    :key="item.path"
                    :to="item.path"
                    class="navigation-item"
                    @click="closeNavigation"
                >
                    <span class="navigation-icon" v-html="item.icon" />
                    <span class="navigation-copy">
                        <strong>{{ item.title }}</strong>
                        <small>{{ item.shortDescription }}</small>
                    </span>
                </RouterLink>
            </nav>

            <div class="sidebar-footer">
                <span class="status-dot" />
                markstream-vue 1.0.0
            </div>
        </aside>

        <button
            v-if="isNavigationOpen"
            class="sidebar-mask"
            type="button"
            aria-label="关闭导航"
            @click="closeNavigation"
        />

        <main class="main-content">
            <div class="page-heading">
                <div>
                    <p class="eyebrow">Renderer configuration</p>
                    <h1>{{ currentRoute.title }}</h1>
                    <p>{{ currentRoute.description }}</p>
                </div>
                <span class="route-path">{{ currentRoute.path }}</span>
            </div>

            <RouterView />
        </main>
    </div>
</template>
