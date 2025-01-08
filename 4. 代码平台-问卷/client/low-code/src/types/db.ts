import type { BaseBusinessComp } from './edit-props'

// 表类型
export interface SurveyDBData {
    createDate: number
    updateDate: number
    id: string
    title: string
    surveyCount: number
    comps: BaseBusinessComp[]
}
