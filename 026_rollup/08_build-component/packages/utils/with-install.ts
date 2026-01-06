import type { App, Component, Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

/**
 * 为组件补齐 install，使其可以通过 app.use() 注册
 */
export function withInstall<T extends Component>(component: T, name: string) {
    const c = component as SFCWithInstall<T>

    c.install = (app: App) => {
        app.component(name, c)
    }

    return c
}
