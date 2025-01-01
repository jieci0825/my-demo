import singleSelectDefaultStatus from './single-select'
import singlePicSelectDefaultStatus from './single-pic-select'
import textNodeDefaultStatus from './text-node'
import { SINGLE_PIC_SELECT_KEY, SINGLE_SELECT_KEY, TEXT_NODE_KEY } from '@/constants'

export const defaultStatusMap = {
    [SINGLE_SELECT_KEY]: singleSelectDefaultStatus(),
    [SINGLE_PIC_SELECT_KEY]: singlePicSelectDefaultStatus(),
    [TEXT_NODE_KEY]: textNodeDefaultStatus()
}
