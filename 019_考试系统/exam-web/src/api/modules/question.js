import request from '../request'

/**
 * 创建题目
 * @description 如果需要批量创建题目，则data需要是一个数组
 * @param {Object} data - 题目数据
 * @param {string} data.title - 题目标题
 * @param {string} data.type - 题目类型
 * @param {Array} data.options - 选项（选择题）
 * @param {string} data.answer - 答案
 * @param {number} data.examId - 考卷ID
 * @returns {Promise}
 */
export const createQuestion = data => {
    return request.post('/question', data)
}

/**
 * 根据ID更新题目
 * @param {number} id - 题目ID
 * @param {Object} data - 更新的题目数据
 * @returns {Promise}
 */
export const updateQuestionById = (id, data) => {
    return request.put(`/question/${id}`, data)
}

/**
 * 根据ID删除题目
 * @param {number} id - 题目ID
 * @returns {Promise}
 */
export const deleteQuestionById = id => {
    return request.delete(`/question/${id}`)
}

/**
 * 根据ID获取题目详情
 * @param {number} id - 题目ID
 * @returns {Promise}
 */
export const getQuestionById = id => {
    return request.get(`/question/${id}`)
}

/**
 * 根据考卷ID获取题目列表
 * @param {number} examId - 考卷ID
 * @returns {Promise}
 */
export const getQuestionsByExamId = examId => {
    return request.get(`/question/exam/${examId}`)
}
