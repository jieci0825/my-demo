import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import registerApp from './global/registerApp'

const app = createApp(App)
registerApp(app)
app.mount('#app')
