import type { App, Plugin } from 'vue'
import { MyButton } from '@my/components'

export { MyButton } from '@my/components'

const components = [MyButton]

const MyComp: Plugin = {
    install(app: App) {
        components.forEach(c => app.use(c))
    }
}

export default MyComp
