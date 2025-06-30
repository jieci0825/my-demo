import optimizer from 'vite-plugin-optimizer'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { devPlugin, getReplacer } from './plugins/dev.plugin.js'
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

// 自定义插件：复制音乐资源
function copyMusicAssets() {
    return {
        name: 'copy-music-assets',
        writeBundle() {
            const sourceDir = 'src/assets/music'
            const targetDir = 'dist/renderer/assets/music'

            if (existsSync(sourceDir)) {
                // 确保目标目录存在
                mkdirSync(targetDir, { recursive: true })

                // 复制所有音乐文件
                const files = readdirSync(sourceDir)
                files.forEach(file => {
                    copyFileSync(join(sourceDir, file), join(targetDir, file))
                })

                console.log('✅ 音乐资源复制完成')
            }
        }
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        // 预构建 ipcRenderer 在 Electron 渲染进程中使用
        // electron: `const { ipcRenderer } = require('electron'); export { ipcRenderer };`,
        optimizer(getReplacer()),
        devPlugin(),
        vue(),
        copyMusicAssets()
    ],
    base: './',
    build: {
        outDir: 'dist/renderer',
        emptyOutDir: true
    }
})
