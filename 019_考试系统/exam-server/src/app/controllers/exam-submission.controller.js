const examSubmissionService = require('../services/exam-submission.service')
const { handleError } = require('@/core/handle-error')

class ExamSubmissionController {
    /**
     * 提交考试答案
     * POST /api/exam-submissions
     */
    async submitExamAnswers(req, res) {
        try {
            const { examPaperId, userAnswers } = req.body
            const userId = req.user?.id // 从认证中间件获取用户ID

            if (!userId) {
                return res.status(401).json({
                    code: 401,
                    message: '用户未认证'
                })
            }

            if (!examPaperId) {
                return res.status(400).json({
                    code: 400,
                    message: '考卷ID不能为空'
                })
            }

            if (!userAnswers || typeof userAnswers !== 'object') {
                return res.status(400).json({
                    code: 400,
                    message: '用户答案格式不正确'
                })
            }

            const submission = await examSubmissionService.submitExamAnswers({
                userId,
                examPaperId,
                userAnswers
            })

            res.status(201).json({
                code: 200,
                message: '考试答案提交成功',
                data: submission
            })
        } catch (error) {
            handleError(error, res)
        }
    }

    /**
     * 获取考试记录列表（分页）
     * GET /api/exam-submissions
     */
    async getExamSubmissions(req, res) {
        try {
            const { page = 1, pageSize = 10, userId, examPaperId } = req.query

            // 如果不是管理员，只能查看自己的记录
            const currentUserId = req.user?.id
            const queryUserId = req.user?.role === 'admin' ? userId : currentUserId

            const result = await examSubmissionService.getExamSubmissions({
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                userId: queryUserId,
                examPaperId: examPaperId ? parseInt(examPaperId) : undefined
            })

            res.json({
                code: 200,
                message: '获取考试记录成功',
                data: result
            })
        } catch (error) {
            handleError(error, res)
        }
    }
}

module.exports = new ExamSubmissionController()
