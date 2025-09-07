const Router = require('koa-router')
const router = new Router({ prefix: '/question' })

const { create, updateById, deleteById, getById, getByExamId } = require('@/app/controllers/question.controller')

// 创建问题
router.post('/', create)

// 根据ID更新问题
router.put('/:id', updateById)

// 根据ID删除问题
router.delete('/:id', deleteById)

// 根据ID获取问题详情（用于编辑时获取问题信息）
router.get('/:id', getById)

// 根据考卷ID获取问题列表
router.get('/exam/:examId', getByExamId)

module.exports = router
