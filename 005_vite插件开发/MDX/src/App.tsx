import { defineComponent } from 'vue'

import Hello from '../hello.mdx'

export default defineComponent({
    setup() {
        return () => (
            <>
                <h1>App</h1>
                <Hello />
            </>
        )
    }
})
