import { PINIA_PERSISTED_PREFIX } from '@/constants'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(
    createPersistedState({
        key: id => `${PINIA_PERSISTED_PREFIX}${id}`
    })
)

export default pinia
