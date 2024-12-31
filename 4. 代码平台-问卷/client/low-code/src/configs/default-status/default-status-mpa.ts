import singleSelectDefaultStatus from './single-select'
import singlePicSelectDefaultStatus from './single-pic-select'
import { SINGLE_PIC_SELECT_KEY, SINGLE_SELECT_KEY } from '@/constants'

export const defaultStatusMap = {
    [SINGLE_SELECT_KEY]: singleSelectDefaultStatus(),
    [SINGLE_PIC_SELECT_KEY]: singlePicSelectDefaultStatus()
}
