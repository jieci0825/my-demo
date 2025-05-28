import { defineConfig } from 'vite'
import JcGlobPlugin from '../src/index'

export default defineConfig({
    plugins: [JcGlobPlugin()],
    server: {
        port: 9527
    }
})
