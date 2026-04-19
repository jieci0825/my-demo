import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import Components from 'unplugin-vue-components/vite'
import IconifyResolver from 'unplugin-icons/resolver'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // 图标按需自动导入
        Components({
            resolvers: [
                IconifyResolver({
                    // 启用的图标集合
                    //  - 如果自定义了图标集合，需要在这里添加
                    enabledCollections: ['mdi', 'carbon', 'custom'],
                    // 修改组件前缀
                    prefix: 'icon',
                }),
            ],
        }),
        Icons({
            // 编译器选项
            compiler: 'vue3',
            // 自动安装图标集
            autoInstall: true,
            // 默认样式
            defaultStyle: 'display: inline-block',
            // 默认类名
            defaultClass: 'svg-icon',
            // 支持 jsx
            jsx: 'react',
            // 自定义图标集合
            customCollections: {
                custom: FileSystemIconLoader('./src/assets/icons', svg => {
                    // 替换 svg 标签的 fill 属性为 currentColor
                    return svg.replace(/^<svg /, '<svg fill="currentColor" ')
                }),
            },
        }),
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
})
