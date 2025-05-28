import Dexie, { type Table } from 'dexie'
import type { SurveyDBData } from '@/types'

class SurveyDataBase extends Dexie {
    surveys!: Table<SurveyDBData, number>
    constructor() {
        // 调用父类的构造函数。传递一个数据库的名称
        super('SurveyDataBase')
        this.version(1).stores({
            surveys: '++id, createDate, updateDate, title, surveyCount, comps'
        })
    }
}

export const db = new SurveyDataBase()
