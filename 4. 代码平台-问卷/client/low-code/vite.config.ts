import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/styles/element/theme-color.scss" as *;`
            }
        }
    },
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()]
        }),
        Components({
            resolvers: [
                //特别注意importStyle不要搞错啦
                ElementPlusResolver({ importStyle: 'sass' })
            ]
        }),
        // 按需定制主题配置
        ElementPlus({
            useSource: true
        })
    ]
})
