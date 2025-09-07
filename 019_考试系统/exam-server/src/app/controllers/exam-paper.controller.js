const { DataSuccess, NotFound, ParameterException } = require('@/core/error-type')
const examPaperService = require('@/app/services/exam-paper.service')

class Controller {
    /**
     * 创建考卷
     */
    async create(ctx) {
        const data = ctx.request.body

        if (!data.name || !data.category) {
            throw new ParameterException('考卷名称和分类不能为空')
        }

        const result = await examPaperService.create(data)
        throw new DataSuccess(result, '创建成功')
    }

    /**
     * 获取考卷列表
     */
    async getList(ctx) {
        const result = await examPaperService.getList()
        throw new DataSuccess(result)
    }

    /**
     * 根据ID获取考卷详情
     */
    async getById(ctx) {
        const { id } = ctx.params

        if (!id) {
            throw new ParameterException('ID不能为空')
        }

        const result = await examPaperService.getById(id)

        if (!result) {
            throw new NotFound('考卷不存在')
        }

        throw new DataSuccess(result)
    }

    /**
     * 根据ID更新考卷
     */
    async updateById(ctx) {
        const { id } = ctx.params
        const data = ctx.request.body

        if (!id) {
            throw new ParameterException('ID不能为空')
        }

        const result = await examPaperService.updateById(id, data)

        if (!result) {
            throw new NotFound('考卷不存在')
        }

        throw new DataSuccess(result, '更新成功')
    }

    /**
     * 根据ID删除考卷
     */
    async deleteById(ctx) {
        const { id } = ctx.params

        if (!id) {
            throw new ParameterException('ID不能为空')
        }

        const result = await examPaperService.deleteById(id)

        if (!result) {
            throw new NotFound('考卷不存在')
        }

        throw new DataSuccess(null, '删除成功')
    }
}

module.exports = new Controller()
