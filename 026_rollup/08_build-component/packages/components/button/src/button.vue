<script setup lang="ts">
import {
    Comment,
    Text,
    computed,
    isVNode,
    useAttrs,
    useSlots,
    type VNode
} from 'vue'
import AsChild from './as-child.vue'
import type {
    MyButtonEmits,
    MyButtonProps,
    MyButtonVariant,
    NativeButtonType
} from './types'

const props = withDefaults(defineProps<MyButtonProps>(), {
    variant: 'primary',
    nativeType: 'button'
})
const emit = defineEmits<MyButtonEmits>()

const attrs = useAttrs()
const slots = useSlots()

function isIgnorableVNode(vnode: VNode) {
    if (vnode.type === Comment) return true
    if (vnode.type === Text) {
        const text = String((vnode.children ?? '') as any)
        return text.trim().length === 0
    }
    return false
}

function pickFirstVNode(children: unknown[]): VNode | null {
    for (const child of children) {
        if (!isVNode(child)) continue
        const vnode = child as VNode
        if (isIgnorableVNode(vnode)) continue
        return vnode
    }
    return null
}

function mergeClasses(a: any, b: any) {
    if (a && b) return [a, b]
    return a || b
}

const isDisabled = computed(() => !!(props.disabled || props.loading))

const hasText = computed(() => {
    const children = slots.default?.() || []
    return children.some(c => isVNode(c) && !isIgnorableVNode(c as VNode))
})

const hasIcon = computed(() => {
    const children = slots.icon?.() || []
    return children.some(c => isVNode(c))
})

const classes = computed(() => [
    attrs.class,
    'my-button',
    `my-button--${props.variant as MyButtonVariant}`,
    {
        'is-loading': !!props.loading,
        'is-disabled': isDisabled.value,
        'is-icon': !hasText.value && hasIcon.value
    }
])

function handleClick(evt: MouseEvent) {
    if (isDisabled.value) {
        evt.preventDefault()
        evt.stopPropagation()
        return
    }
    emit('click', evt)
}
</script>

<template>
    <AsChild
        v-if="props.asChild"
        :class-list="classes"
        :forward-attrs="attrs"
        :disabled="isDisabled"
        @click="handleClick"
    >
        <slot />
    </AsChild>

    <button
        v-else
        v-bind="attrs"
        :type="(props.nativeType as NativeButtonType)"
        :class="classes"
        :disabled="isDisabled"
        :aria-busy="props.loading ? 'true' : undefined"
        @click="handleClick"
    >
        <span
            v-if="props.loading"
            class="my-button__spinner"
            aria-hidden="true"
        ></span>
        <span
            v-if="hasIcon"
            class="my-button__icon"
            aria-hidden="true"
        >
            <slot name="icon" />
        </span>
        <span
            v-if="hasText"
            class="my-button__text"
        >
            <slot />
        </span>
    </button>
</template>
