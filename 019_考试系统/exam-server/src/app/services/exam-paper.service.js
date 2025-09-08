const { ExamPaper, ExamPaperQuestion, Question } = require('@/app/models')

class Service {
    /**
     * 创建考卷
     * @param {Object} data 考卷数据
     * @returns {Object} 创建的考卷信息
     */
    async create(data) {
        const examPaper = await ExamPaper.create({
            name: data.name,
            category: data.category
        })
        return examPaper.toJSON()
    }

    /**
     * 获取考卷列表
     * @returns {Array} 考卷列表
     */
    async getList() {
        const examPapers = await ExamPaper.findAll({
            order: [['id', 'DESC']]
        })
        return examPapers.map(item => item.toJSON())
    }

    /**
     * 根据ID获取考卷详情
     * @param {number} id 考卷ID
     * @returns {Object|null} 考卷信息
     */
    async getById(id) {
        const examPaper = await ExamPaper.findByPk(id)
        if (!examPaper) {
            return null
        }

        // 获取考卷下的所有题目
        // 1. 先查询考卷题目关联表，获取题目ID列表
        const examPaperQuestions = await ExamPaperQuestion.findAll({
            where: { exam_paper_id: id }
        })

        const examPaperData = examPaper.toJSON()

        if (examPaperQuestions.length === 0) {
            examPaperData.questions = []
            return examPaperData
        }

        // 2. 提取题目ID列表
        const questionIds = examPaperQuestions.map(epq => epq.question_id)

        // 3. 根据题目ID查询具体的题目信息，并按sn升序排序
        const questions = await Question.findAll({
            where: {
                id: questionIds
            },
            order: [['sn', 'ASC']]
        })

        examPaperData.questions = questions.map(question => question.toJSON())

        return examPaperData
    }

    /**
     * 根据ID更新考卷
     * @param {number} id 考卷ID
     * @param {Object} data 更新数据
     * @returns {Object|null} 更新后的考卷信息
     */
    async updateById(id, data) {
        const examPaper = await ExamPaper.findByPk(id)
        if (!examPaper) {
            return null
        }

        const updateData = {}
        if (data.name !== undefined) {
            updateData.name = data.name
        }
        if (data.category !== undefined) {
            updateData.category = data.category
        }

        await examPaper.update(updateData)
        return examPaper.toJSON()
    }

    /**
     * 根据ID删除考卷
     * @param {number} id 考卷ID
     * @returns {boolean} 是否删除成功
     */
    async deleteById(id) {
        const examPaper = await ExamPaper.findByPk(id)
        if (!examPaper) {
            return false
        }

        await examPaper.destroy()
        return true
    }

    /**
     * 根据条件获取考卷
     * @param {string} value 查询值
     * @param {string} key 查询字段，默认为 'name'
     * @returns {Object|null} 考卷信息
     */
    async getByCondition(value, key = 'name') {
        const examPaper = await ExamPaper.findOne({
            where: {
                [key]: value
            }
        })
        return examPaper ? examPaper.toJSON() : null
    }
}

module.exports = new Service()
