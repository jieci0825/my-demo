const { ExamSubmission } = require('../models')
const { ExamPaper } = require('../models')
const { Question } = require('../models')
const { Op, sequelize } = require('sequelize')
const { sequelize: dbInstance } = require('@/core/db')

class ExamSubmissionService {
    /**
     * 提交考试答案
     * @param {Object} data - 提交数据
     * @param {number} data.userId - 用户ID
     * @param {number} data.examPaperId - 考卷ID
     * @param {Object} data.userAnswers - 用户答案对象，key为题目ID，value为答案
     * @returns {Promise<Object>} 提交记录
     */
    async submitExamAnswers(data) {
        const { userId, examPaperId, userAnswers } = data

        // 检查考卷是否存在
        const examPaper = await ExamPaper.findByPk(examPaperId)
        if (!examPaper) {
            throw new Error('考卷不存在')
        }

        // 检查是否已经提交过
        const existingSubmission = await ExamSubmission.findOne({
            where: {
                userId,
                examPaperId
            }
        })

        if (existingSubmission) {
            throw new Error('该考试已经提交过答案')
        }

        // 计算总分（如果需要自动计算）
        let totalScore = null
        if (userAnswers && Object.keys(userAnswers).length > 0) {
            totalScore = await this.calculateScore(examPaperId, userAnswers)
        }

        // 创建提交记录
        const submission = await ExamSubmission.create({
            userId,
            examPaperId,
            userAnswers,
            totalScore,
            submittedAt: new Date()
        })

        return submission
    }

    /**
     * 计算考试分数
     * @param {number} examPaperId - 考卷ID
     * @param {Object} userAnswers - 用户答案
     * @returns {Promise<number>} 总分
     */
    async calculateScore(examPaperId, userAnswers) {
        try {
            // 获取考卷的所有题目
            const examPaper = await ExamPaper.findByPk(examPaperId, {
                include: [
                    {
                        model: Question,
                        through: { attributes: ['score'] }
                    }
                ]
            })

            if (!examPaper || !examPaper.Questions) {
                return 0
            }

            let totalScore = 0

            // 遍历每个题目，计算得分
            for (const question of examPaper.Questions) {
                const questionId = question.id.toString()
                const userAnswer = userAnswers[questionId]

                if (userAnswer !== undefined && userAnswer !== null) {
                    // 根据题目类型判断答案是否正确
                    const isCorrect = this.checkAnswer(question, userAnswer)

                    if (isCorrect) {
                        // 获取该题目的分数
                        const questionScore = question.ExamPaperQuestion?.score || 0
                        totalScore += parseFloat(questionScore)
                    }
                }
            }

            return totalScore
        } catch (error) {
            return 0
        }
    }

    /**
     * 检查答案是否正确
     * @param {Object} question - 题目对象
     * @param {any} userAnswer - 用户答案
     * @returns {boolean} 是否正确
     */
    checkAnswer(question, userAnswer) {
        const correctAnswer = question.correctAnswer

        switch (question.type) {
            case 'single_choice':
            case 'true_false':
                return userAnswer === correctAnswer

            case 'multiple_choice':
                // 多选题需要比较数组
                if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) {
                    return false
                }
                if (userAnswer.length !== correctAnswer.length) {
                    return false
                }
                return userAnswer.sort().join(',') === correctAnswer.sort().join(',')

            case 'fill_blank':
            case 'short_answer':
                // 填空题和简答题进行字符串比较（忽略大小写和空格）
                const userAnswerStr = String(userAnswer).trim().toLowerCase()
                const correctAnswerStr = String(correctAnswer).trim().toLowerCase()
                return userAnswerStr === correctAnswerStr

            default:
                return false
        }
    }

    /**
     * 获取考试记录列表（分页）
     * @param {Object} params - 查询参数
     * @param {number} params.page - 页码
     * @param {number} params.pageSize - 每页数量
     * @param {number} [params.userId] - 用户ID（可选）
     * @param {number} [params.examPaperId] - 考卷ID（可选）
     * @returns {Promise<Object>} 分页结果
     */
    async getExamSubmissions(params) {
        const { page = 1, pageSize = 10, userId, examPaperId } = params

        const offset = (page - 1) * pageSize
        const where = {}

        // 添加筛选条件
        if (userId) {
            where.userId = userId
        }
        if (examPaperId) {
            where.examPaperId = examPaperId
        }

        const { count, rows } = await ExamSubmission.findAndCountAll({
            where,
            limit: parseInt(pageSize),
            offset: parseInt(offset),
            order: [['submittedAt', 'DESC']]
        })

        // 获取所有考卷ID并补全考卷信息
        const examPaperIds = [...new Set(rows.map(item => item.examPaperId))]
        let examPapersMap = {}

        if (examPaperIds.length > 0) {
            const examPapers = await ExamPaper.findAll({
                where: {
                    id: examPaperIds
                },
                attributes: ['id', 'name']
            })

            // 构建考卷信息映射表
            examPapersMap = examPapers.reduce((map, paper) => {
                map[paper.id] = paper.toJSON()
                return map
            }, {})
        }

        // 为每个提交记录补全考卷信息
        const listWithExamPaper = rows.map(item => {
            const itemData = item.toJSON()
            itemData.examPaper = examPapersMap[item.examPaperId] || null
            return itemData
        })

        return {
            list: listWithExamPaper,
            pagination: {
                page: parseInt(page),
                pageSize: parseInt(pageSize),
                total: count,
                totalPages: Math.ceil(count / pageSize)
            }
        }
    }
}

module.exports = new ExamSubmissionService()
