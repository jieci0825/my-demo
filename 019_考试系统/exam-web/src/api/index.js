import request from './request.js'

// 导出封装好的请求实例
export default request

// 导出所有 API 模块
export * as authApi from './modules/auth'
export * as questionApi from './modules/question'
export * as examPaperApi from './modules/exam-paper.js'
export * as examSubmissionApi from './modules/exam-submission.js'

// 也可以导出一些常用的请求方法
export const get = (url, params) => request.get(url, { params })
export const post = (url, data) => request.post(url, data)
export const put = (url, data) => request.put(url, data)
export const del = url => request.delete(url)
