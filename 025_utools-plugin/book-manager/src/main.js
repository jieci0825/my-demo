import App from './App.vue'
import { createApp } from 'vue'
import './styles/index.scss'

function bootstrap() {
    const app = createApp(App)
    app.mount('#app')
}

bootstrap()
