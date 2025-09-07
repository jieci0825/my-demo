import request from '../request'

/**
 * 创建考卷
 * @param {Object} data - 考卷数据
 * @param {string} data.title - 考卷标题
 * @param {string} data.description - 考卷描述
 * @param {number} data.duration - 考试时长（分钟）
 * @param {Date} data.startTime - 开始时间
 * @param {Date} data.endTime - 结束时间
 * @returns {Promise}
 */
export const createExamPaper = data => {
    return request.post('/exam-paper', data)
}

/**
 * 获取考卷列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.limit - 每页数量
 * @returns {Promise}
 */
export const getExamPaperList = params => {
    return request.get('/exam-paper', { params })
}

/**
 * 根据ID获取考卷详情
 * @param {number} id - 考卷ID
 * @returns {Promise}
 */
export const getExamPaperById = id => {
    return request.get(`/exam-paper/${id}`)
}

/**
 * 根据ID更新考卷
 * @param {number} id - 考卷ID
 * @param {Object} data - 更新的考卷数据
 * @returns {Promise}
 */
export const updateExamPaperById = (id, data) => {
    return request.put(`/exam-paper/${id}`, data)
}

/**
 * 根据ID删除考卷
 * @param {number} id - 考卷ID
 * @returns {Promise}
 */
export const deleteExamPaperById = id => {
    return request.delete(`/exam-paper/${id}`)
}
