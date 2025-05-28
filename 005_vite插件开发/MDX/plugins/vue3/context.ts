import { computed, createVNode, defineComponent, inject, PropType, provide, ref, VNodeTypes } from 'vue'

export const contextKey = '__MDX__PROVIDE_KEY'

export const MDXProvide = defineComponent({
    name: 'MDXProvide',
    props: {
        component: {
            type: Object as PropType<Record<string, VNodeTypes>>,
            required: true
        }
    },
    setup(props, { slots }) {
        const componentRef = computed(() => props.component)

        provide(contextKey, componentRef)

        return () => slots.default?.()
    }
})

const defaultComponentRef = computed(() => ({}))
export const useMDXComponent = (getPropComponents: () => Record<string, VNodeTypes>) => {
    const providedComponentsRef = inject(contextKey, defaultComponentRef)

    const mergeComponentsRef = computed(() => ({
        ...providedComponentsRef.value,
        ...getPropComponents()
    }))

    return mergeComponentsRef
}
