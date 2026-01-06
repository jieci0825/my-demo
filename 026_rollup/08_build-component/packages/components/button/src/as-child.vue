<script lang="ts">
import {
    cloneVNode,
    defineComponent,
    isVNode,
    type PropType,
    type VNode,
    Comment,
    Text
} from 'vue'

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

export default defineComponent({
    name: 'MyButtonAsChild',
    props: {
        classList: {
            type: [String, Array, Object] as PropType<any>,
            default: undefined
        },
        forwardAttrs: {
            type: Object as PropType<Record<string, any>>,
            default: () => ({})
        },
        disabled: Boolean
    },
    emits: {
        click: (_evt: MouseEvent) => true
    },
    setup(childProps, { emit: childEmit, slots }) {
        return () => {
            const children = slots.default?.() || []
            const vnode = pickFirstVNode(children)
            if (!vnode) return null

            const existingProps = (vnode.props || {}) as Record<string, any>
            const mergedOnClick = (evt: MouseEvent) => {
                const origin = existingProps.onClick
                if (typeof origin === 'function') origin(evt)
                childEmit('click', evt)
            }

            return cloneVNode(vnode, {
                ...childProps.forwardAttrs,
                ...existingProps,
                'class': mergeClasses(
                    existingProps.class,
                    childProps.classList
                ),
                'onClick': mergedOnClick,
                'aria-disabled': childProps.disabled ? 'true' : undefined,
                'tabindex': childProps.disabled ? -1 : existingProps.tabindex
            })
        }
    }
})
</script>
