const { DataSuccess, NotFound, ParamsError } = require('@/core/error-type')
const questionService = require('@/app/services/question.service')

class Controller {
    /**
     * 创建问题（支持单个或批量创建）
     */
    async create(ctx) {
        const data = ctx.request.body

        // 检查是否为数组（批量创建）
        if (Array.isArray(data)) {
            // 批量创建验证
            if (data.length === 0) {
                throw new ParamsError('问题数组不能为空')
            }

            // 验证每个问题的必填字段
            for (let i = 0; i < data.length; i++) {
                const question = data[i]
                if (!question.sn || !question.question || !question.type || !question.answer || !question.exam_id) {
                    throw new ParamsError(`第${i + 1}个问题的题号、问题、问题类型、答案和考卷ID不能为空`)
                }
            }

            const result = await questionService.createBatch(data)
            throw new DataSuccess(result, `批量创建${data.length}个问题成功`)
        } else {
            // 单个创建验证
            if (!data.sn || !data.question || !data.type || !data.answer || !data.exam_id) {
                throw new ParamsError('题号、问题、问题类型、答案和考卷ID不能为空')
            }

            const result = await questionService.create(data)
            throw new DataSuccess(result, '创建问题成功')
        }
    }

    /**
     * 根据ID更新问题
     */
    async updateById(ctx) {
        const { id } = ctx.params
        const data = ctx.request.body

        if (!id) {
            throw new ParamsError('问题ID不能为空')
        }

        const result = await questionService.updateById(id, data)

        if (!result) {
            throw new NotFound('问题不存在')
        }

        throw new DataSuccess(result, '更新问题成功')
    }

    /**
     * 根据ID删除问题
     */
    async deleteById(ctx) {
        const { id } = ctx.params

        if (!id) {
            throw new ParamsError('问题ID不能为空')
        }

        const result = await questionService.deleteById(id)

        if (!result) {
            throw new NotFound('问题不存在')
        }

        throw new DataSuccess(null, '删除问题成功')
    }

    /**
     * 根据ID获取问题详情
     */
    async getById(ctx) {
        const { id } = ctx.params

        if (!id) {
            throw new ParamsError('问题ID不能为空')
        }

        const result = await questionService.getById(id)

        if (!result) {
            throw new NotFound('问题不存在')
        }

        throw new DataSuccess(result)
    }

    /**
     * 根据考卷ID获取问题列表
     */
    async getByExamId(ctx) {
        const { examId } = ctx.params

        if (!examId) {
            throw new ParamsError('考卷ID不能为空')
        }

        const result = await questionService.getByExamId(examId)
        throw new DataSuccess(result)
    }
}

module.exports = new Controller()
