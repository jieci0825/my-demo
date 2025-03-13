import {
    DATE_TIME_KEY,
    OPTION_SELECT_KEY,
    PRESET_PERSONAL_INFO_BIRTH_KEY,
    RATE_SCORE_KEY,
    TEXT_NODE_KEY
} from '@/constants'
import { computed, type ComputedRef } from 'vue'
import type { BaseBusinessComp } from '@/types'

// 是否是题目类型
export const isQuestionType = (type: string) => {
    const excludes = [TEXT_NODE_KEY]
    if (excludes.includes(type)) {
        return false
    }
    return true
}

// 是否支持PDF导出
export const isSupportPdfExport = (type: string) => {
    const excludes = [DATE_TIME_KEY, RATE_SCORE_KEY, PRESET_PERSONAL_INFO_BIRTH_KEY, OPTION_SELECT_KEY]
    if (excludes.includes(type)) {
        return false
    }
    return true
}

// 获取出渲染序号的数组
export const getRenderSnList = (comps: BaseBusinessComp[]): ComputedRef<Array<null | number>> => {
    let sn = 1
    return computed(() => {
        return comps.map(comp => {
            if (isQuestionType(comp.name)) {
                return sn++
            }
            // 如果不是题目类型，则返回一个 null 不进行渲染
            return null
        })
    })
}

// 格式化日期时间
export const formatDate = (date: string | number) => {
    return new Date(date).toLocaleString()
}
