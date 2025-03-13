import { db } from './db'
import type { SurveyDBData } from '@/types'

// 插入数据
export const insertSurveryData = async (data: SurveyDBData) => {
    return await db.surveys.add(data)
}

// 查询所有数据
export const getAllSurveryData = async () => {
    return await db.surveys.toArray()
}

// 根据id查询某一条数据
export const getSurveryDataById = async (id: number) => {
    return await db.surveys.get(id)
}

// 根据id删除某一条数据
export const deleteSurveryDataById = async (id: number) => {
    return await db.surveys.delete(id)
}

// 根据id更新某一条数据
export const updateSurveryDataById = async (id: number, data: Partial<SurveyDBData>) => {
    return await db.surveys.update(id, data)
}
