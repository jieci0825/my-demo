<script setup lang="ts">
import AppBrand from './AppBrand.vue'

defineProps<{
    navigationOpen: boolean
}>()

defineEmits<{
    toggle: []
}>()
</script>

<template>
    <header class="mobile-header">
        <AppBrand compact />
        <button
            class="menu-button"
            type="button"
            aria-label="切换导航"
            :aria-expanded="navigationOpen"
            @click="$emit('toggle')"
        >
            <span />
            <span />
            <span />
        </button>
    </header>
</template>

<style scoped lang="scss">
.mobile-header {
    display: none;
}

@media (max-width: 900px) {
    .mobile-header {
        position: sticky;
        top: 0;
        z-index: 15;
        display: flex;
        height: 64px;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        border-bottom: 1px solid #dddfda;
        background: rgb(248 249 246 / 92%);
        backdrop-filter: blur(12px);

        .menu-button {
            display: grid;
            width: 36px;
            height: 36px;
            place-content: center;
            gap: 4px;
            border: 0;
            border-radius: 7px;
            cursor: pointer;
            background: transparent;

            span {
                width: 16px;
                height: 1.5px;
                background: #454c46;
            }
        }

        .menu-button:hover {
            background: #eceee9;
        }
    }
}
</style>
