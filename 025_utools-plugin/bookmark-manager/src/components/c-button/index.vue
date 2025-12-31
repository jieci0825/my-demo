<script setup>
import { computed } from 'vue'

const props = defineProps({
    type: {
        type: String,
        default: 'default' // default | primary
    },
    size: {
        type: String,
        default: 'default' // small | default | large
    },
    circle: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => {
    return [
        'c-button',
        `c-button--${props.type}`,
        `c-button--${props.size}`,
        {
            'is-circle': props.circle
        }
    ]
})

const handleClick = e => {
    emit('click', e)
}
</script>

<template>
    <button
        :class="buttonClass"
        @click="handleClick"
    >
        <span class="c-button__content">
            <slot></slot>
        </span>
    </button>
</template>

<style scoped lang="scss">
.c-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 15px;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    background: var(--color-bg);
    color: var(--color-text-body);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    outline: none;
    user-select: none;

    &:hover {
        background: var(--color-bg-hover);
        border-color: var(--color-border-active);
    }

    &:active {
        opacity: 0.8;
    }

    // Primary 类型
    &--primary {
        background: var(--color-accent);
        color: #fff;
        border-color: var(--color-accent);

        &:hover {
            opacity: 0.9;
            background: var(--color-accent);
            border-color: var(--color-accent);
        }
    }

    // 尺寸
    &--small {
        padding: 5px 11px;
        font-size: 12px;
    }

    &--large {
        padding: 12px 19px;
        font-size: 16px;
    }

    // 圆形按钮
    &.is-circle {
        padding: 0;
        border-radius: 50%;

        &.c-button--small {
            width: 32px;
            height: 32px;
        }

        &.c-button--default {
            width: 40px;
            height: 40px;
        }

        &.c-button--large {
            width: 48px;
            height: 48px;
        }
    }

    &__content {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
