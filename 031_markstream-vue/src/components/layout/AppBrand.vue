<script setup lang="ts">
withDefaults(defineProps<{
    compact?: boolean
}>(), {
    compact: false,
})
</script>

<template>
    <div class="app-brand" :class="{ 'is-compact': compact }">
        <span class="brand-mark">M</span>
        <div>
            <strong>Markstream Lab</strong>
            <small v-if="!compact">Vue renderer playground</small>
        </div>
    </div>
</template>

<style scoped lang="scss">
.app-brand {
    display: flex;
    align-items: center;
    gap: 12px;

    .brand-mark {
        display: grid;
        width: 34px;
        height: 34px;
        flex: 0 0 auto;
        place-items: center;
        border-radius: 8px;
        color: #fff;
        background: #276749;
        font-size: 15px;
        font-weight: 700;
    }

    strong {
        display: block;
        color: #1d211e;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: -0.01em;
    }

    small {
        display: block;
        margin-top: 3px;
        color: #8a908b;
        font-size: 11px;
    }
}

.app-brand.is-compact {
    .brand-mark {
        width: 30px;
        height: 30px;
    }
}
</style>
