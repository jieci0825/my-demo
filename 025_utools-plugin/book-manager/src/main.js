import App from './App.vue'

import { createApp } from 'vue'
import { dbTool } from './utils'
import { isDev } from './configs'

import './styles/index.scss'

function bootstrap() {
    const app = createApp(App)
    app.mount('#app')

    if (isDev) {
        const docs = dbTool.allDocs()
        console.log('DB: ', docs)
    }
}

bootstrap()
