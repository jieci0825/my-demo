const { Question } = require('@/app/models/question.model')
const { Op } = require('sequelize')

class Service {
    /**
     * 创建问题
     * @param {Object} data 问题数据
     * @returns {Object} 创建的问题信息
     */
    async create(data) {
        const question = await Question.create({
            sn: data.sn,
            question: data.question,
            type: data.type,
            answer: data.answer,
            analysis: data.analysis,
            options: data.options || ''
        })
        return question.toJSON()
    }

    /**
     * 批量创建问题
     * @param {Array} dataArray 问题数据数组
     * @returns {Array} 创建的问题信息数组
     */
    async createBatch(dataArray) {
        const questionsData = dataArray.map(data => ({
            sn: data.sn,
            question: data.question,
            type: data.type,
            answer: data.answer,
            analysis: data.analysis,
            options: data.options || ''
        }))

        await Question.bulkCreate(questionsData)
    }

    /**
     * 根据ID更新问题
     * @param {number} id 问题ID
     * @param {Object} data 更新数据
     * @returns {Object|null} 更新后的问题信息
     */
    async updateById(id, data) {
        const question = await Question.findByPk(id)
        if (!question) {
            return null
        }

        const updateData = {}
        if (data.sn !== undefined) {
            updateData.sn = data.sn
        }
        if (data.question !== undefined) {
            updateData.question = data.question
        }
        if (data.type !== undefined) {
            updateData.type = data.type
        }
        if (data.answer !== undefined) {
            updateData.answer = data.answer
        }
        if (data.analysis !== undefined) {
            updateData.analysis = data.analysis
        }
        if (data.options !== undefined) {
            updateData.options = data.options
        }

        await question.update(updateData)
        return question.toJSON()
    }

    /**
     * 根据ID删除问题
     * @param {number} id 问题ID
     * @returns {boolean} 是否删除成功
     */
    async deleteById(id) {
        const question = await Question.findByPk(id)
        if (!question) {
            return false
        }

        await question.destroy()
        return true
    }

    /**
     * 根据ID获取问题详情
     * @param {number} id 问题ID
     * @returns {Object|null} 问题信息
     */
    async getById(id) {
        const question = await Question.findByPk(id)
        return question ? question.toJSON() : null
    }

    /**
     * 获取问题列表（支持分页和动态查询）
     * @param {Object} options 查询选项
     * @param {number} options.page 页码
     * @param {number} options.limit 每页条数
     * @param {Object} options.conditions 查询条件
     * @returns {Object} 包含列表和分页信息的对象
     */
    async getList({ page, limit, conditions }) {
        // 构建 where 条件
        const where = {}

        if (conditions.type) {
            where.type = conditions.type
        }

        if (conditions.title) {
            where.question = {
                [Op.like]: `%${conditions.title}%`
            }
        }

        // 计算偏移量
        const offset = (page - 1) * limit

        // 查询数据和总数
        const { count, rows } = await Question.findAndCountAll({
            where,
            order: [['sn', 'ASC']],
            limit,
            offset
        })

        return {
            list: rows.map(item => item.toJSON()),
            total: count
        }
    }
}

module.exports = new Service()
