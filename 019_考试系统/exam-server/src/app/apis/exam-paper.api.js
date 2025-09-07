const Router = require('koa-router')
const router = new Router({ prefix: '/exam-paper' })

const { create, getList, getById, updateById, deleteById } = require('@/app/controllers/exam-paper.controller')

// 创建考卷
router.post('/', create)

// 获取考卷列表
router.get('/', getList)

// 根据ID获取考卷详情
router.get('/:id', getById)

// 根据ID更新考卷
router.put('/:id', updateById)

// 根据ID删除考卷
router.delete('/:id', deleteById)

module.exports = router
