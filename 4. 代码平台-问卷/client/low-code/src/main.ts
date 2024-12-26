import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

import { zhCn } from 'element-plus/es/locales.mjs'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/styles/index.scss'

const app = createApp(App)

app.use(ElementPlus, { size: 'default', locale: zhCn })
app.use(router)
app.use(createPinia())

app.mount('#app')
