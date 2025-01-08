import type { BaseBusinessComp } from './edit-props'

// 表类型
export interface SurveyDBData {
    createDate: number
    updateDate: number
    title: string
    surveyCount: number
    comps: BaseBusinessComp[]
}
