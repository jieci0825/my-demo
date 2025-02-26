import { createVNode, defineComponent, Fragment, PropType, type VNodeTypes } from 'vue'
import { useMDXComponent } from './context'

const TYPE_PROP_NAME = 'mdxType'

const DEFAULTS = {
    inlineCode: 'code',
    wrapper: (props, { slots }) => createVNode(Fragment, {}, slots)
}

const CreateMDXComponent = defineComponent({
    name: 'CreateMDXComponent',
    props: {
        component: {
            type: Object as PropType<() => Record<string, VNodeTypes>>,
            default: () => ({})
        },
        originalType: String,
        mdxType: String,
        parentString: String
    },
    setup(props, { slots }) {
        return () => {
            const componentsRef = useMDXComponent(props.component)
            const components = componentsRef.value
            const { originalType, parentString, mdxType: type, ...etc } = props

            const Components =
                components[`${parentString}.${type}`] || components[type!] || DEFAULTS[type!] || originalType
            return createVNode(Components, { ...etc }, slots)
        }
    }
})

export default function mdx(type: VNodeTypes, props: any, children: any) {
    let component = type
    let newProps = props
    let mdxType = props && props.mdxType

    if (typeof type === 'string' || mdxType) {
        component = CreateMDXComponent
        newProps = {}

        for (const key in props) {
            if (Object.prototype.hasOwnProperty.call(props, key)) {
                newProps[key] = props[key]
            }
        }

        newProps.originalType = type
        newProps[TYPE_PROP_NAME] = typeof type === 'string' ? type : mdxType
    }

    return createVNode(component, newProps, children)
}
