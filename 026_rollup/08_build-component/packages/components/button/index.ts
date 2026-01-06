import { withInstall } from '@my/utils'
import _MyButton from './src/button.vue'

export const MyButton = withInstall(_MyButton, 'MyButton')

export default MyButton

export * from './src/types'
