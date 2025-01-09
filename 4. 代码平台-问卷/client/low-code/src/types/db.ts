import type { BaseBusinessComp } from './edit-props'

// 表类型
export interface SurveyDBData {
    createDate: number | string
    updateDate: number | string
    title: string
    surveyCount: number
    comps: BaseBusinessComp[]
}
