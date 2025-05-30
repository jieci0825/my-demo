import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        // vitest 启用全局模式，即可自动的将测试工具作为全局变量可用
        globals: true,
        // 配置测试文件运行环境
        environment: 'node'
    }
})
