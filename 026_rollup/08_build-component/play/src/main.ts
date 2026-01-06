import { createApp } from 'vue'
import MyComp from '@my/my-comp'
import '@my/theme-chalk/index.css'
import './style.css'
import App from './App.vue'

createApp(App).use(MyComp).mount('#app')
