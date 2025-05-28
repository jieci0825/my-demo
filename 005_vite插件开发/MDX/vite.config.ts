import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteMdx from './plugins/vite-mdx'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vite.dev/config/
export default defineConfig({
    // ViteMdx 插件的处理需要在 vueJsx 插件之前
    plugins: [
        ViteMdx(),
        vueJsx({
            include: /\.(jsx|tsx|mdx)/
        }),
        vue()
    ]
})
