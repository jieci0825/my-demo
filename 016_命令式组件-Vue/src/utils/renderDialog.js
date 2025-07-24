import { ElDialog } from 'element-plus'
import { createApp, h, ref } from 'vue'
import registerApp from '../global/registerApp'

/**
 * TODO: 后续可以通过参数归一化来优化参数的传递，同时优化插槽的配置，配置默认的 footer 实现 el-dialog 和 el-form 的联动
 */
export function renderDialog(component, props = {}, dialogProps = {}) {
    const instance = ref(null)
    const dialogVisible = ref(true)

    const vnode = h(
        ElDialog,
        {
            ...dialogProps,
            modelValue: dialogVisible.value,
            onClosed: () => {
                unmount()
            }
        },
        {
            default: () => h(component, { ...props, ref: instance })
        }
    )

    const container = document.createElement('div')
    const app = createApp(vnode)
    registerApp(app)
    app.mount(container)

    const el = container.firstElementChild
    document.body.appendChild(el)

    function unmount() {
        app.unmount()
        document.body.removeChild(el)
    }

    return {
        unmount,
        instance
    }
}
