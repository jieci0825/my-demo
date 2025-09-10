const { Question } = require('./question.model')
const { User } = require('./users.model')
const { ExamPaper } = require('./exam-paper.model')
const { ExamPaperQuestion } = require('./exam-paper-question.model')
const { ExamSubmission } = require('./exam-submission.model')

module.exports = {
    User,
    Question,
    ExamPaper,
    ExamPaperQuestion,
    ExamSubmission
}
