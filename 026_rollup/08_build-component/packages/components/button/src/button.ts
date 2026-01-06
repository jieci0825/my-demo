import {
    Comment,
    Text,
    cloneVNode,
    computed,
    defineComponent,
    h,
    isVNode,
    type PropType,
    type VNode
} from 'vue'

export const myButtonVariants = [
    'primary',
    'secondary',
    'danger',
    'outline',
    'ghost',
    'link'
] as const

export type MyButtonVariant = (typeof myButtonVariants)[number]

type NativeButtonType = 'button' | 'submit' | 'reset'

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

export const MyButton = defineComponent({
    name: 'MyButton',
    props: {
        variant: {
            type: String as PropType<MyButtonVariant>,
            default: 'primary'
        },
        loading: Boolean,
        disabled: Boolean,
        asChild: Boolean,
        nativeType: {
            type: String as PropType<NativeButtonType>,
            default: 'button'
        }
    },
    emits: {
        click: (_evt: MouseEvent) => true
    },
    setup(props, { emit, slots, attrs }) {
        const isDisabled = computed(() => props.disabled || props.loading)

        const hasDefault = computed(() => {
            const children = slots.default?.() || []
            return children.some(
                c => isVNode(c) && !isIgnorableVNode(c as VNode)
            )
        })

        const hasIcon = computed(() => {
            const children = slots.icon?.() || []
            return children.some(c => isVNode(c))
        })

        const classes = computed(() => [
            'my-button',
            `my-button--${props.variant}`,
            {
                'is-loading': props.loading,
                'is-disabled': isDisabled.value,
                'is-icon': !hasDefault.value && hasIcon.value
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

        function renderContent() {
            const children: any[] = []

            if (props.loading) {
                children.push(
                    h('span', {
                        'class': 'my-button__spinner',
                        'aria-hidden': 'true'
                    })
                )
            }

            const iconSlot = slots.icon?.()
            if (iconSlot && iconSlot.length) {
                children.push(
                    h(
                        'span',
                        { 'class': 'my-button__icon', 'aria-hidden': 'true' },
                        iconSlot
                    )
                )
            }

            const defaultSlot = slots.default?.() || []
            const meaningfulDefault = defaultSlot.filter(
                c => isVNode(c) && !isIgnorableVNode(c as VNode)
            )
            if (meaningfulDefault.length) {
                children.push(
                    h('span', { class: 'my-button__text' }, meaningfulDefault)
                )
            }

            return children
        }

        return () => {
            if (props.asChild) {
                const children = slots.default?.() || []
                const vnode = pickFirstVNode(children)
                if (!vnode) return null

                const existingProps = (vnode.props || {}) as Record<string, any>
                const mergedOnClick = (evt: MouseEvent) => {
                    const origin = existingProps.onClick
                    if (typeof origin === 'function') origin(evt)
                    handleClick(evt)
                }

                return cloneVNode(vnode, {
                    ...attrs,
                    ...existingProps,
                    'class': mergeClasses(existingProps.class, classes.value),
                    'onClick': mergedOnClick,
                    'aria-disabled': isDisabled.value ? 'true' : undefined,
                    'tabindex': isDisabled.value ? -1 : existingProps.tabindex
                })
            }

            return h(
                'button',
                {
                    ...attrs,
                    'type': props.nativeType,
                    'class': classes.value,
                    'disabled': isDisabled.value,
                    'aria-busy': props.loading ? 'true' : undefined,
                    'onClick': handleClick
                },
                renderContent()
            )
        }
    }
})

export default MyButton
