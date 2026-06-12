<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

import AppMain from './components/layout/AppMain.vue'
import AppMobileHeader from './components/layout/AppMobileHeader.vue'
import AppSidebar from './components/layout/AppSidebar.vue'

const isNavigationOpen = ref(false)

function closeNavigation() {
    isNavigationOpen.value = false
}
</script>

<template>
    <div class="app-shell">
        <AppMobileHeader
            :navigation-open="isNavigationOpen"
            @toggle="isNavigationOpen = !isNavigationOpen"
        />
        <AppSidebar :open="isNavigationOpen" @close="closeNavigation" />
        <AppMain>
            <RouterView />
        </AppMain>
    </div>
</template>
