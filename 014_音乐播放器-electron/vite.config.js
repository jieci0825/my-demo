import optimizer from 'vite-plugin-optimizer'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { devPlugin, getReplacer } from './plugins/dev.plugin.js'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        // 预构建 ipcRenderer 在 Electron 渲染进程中使用
        // electron: `const { ipcRenderer } = require('electron'); export { ipcRenderer };`,
        optimizer(getReplacer()),
        devPlugin(),
        vue()
    ]
})
