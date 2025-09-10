const Router = require('koa-router')
const examSubmissionController = require('../controllers/exam-submission.controller')
const { verifyToken } = require('@/middleware/auth.middleware')

const router = new Router({
    prefix: '/exam-submissions'
})

router.use(verifyToken)

router.post('/', examSubmissionController.submitExamAnswers)

router.get('/', examSubmissionController.getExamSubmissions)

module.exports = router
