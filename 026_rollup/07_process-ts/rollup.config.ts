import { RollupOptions } from 'rollup'
import typescript from '@rollup/plugin-typescript'

const config: RollupOptions = {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'es'
    },
    plugins: [typescript()]
}

export default config
