const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('@/core/db')

class ExamPaperQuestion extends Model {}

ExamPaperQuestion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // 考卷ID
        exam_paper_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'exam_papers',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        // 问题ID
        question_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'questions',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    },
    {
        sequelize,
        tableName: 'exam_paper_questions'
    }
)

module.exports = { ExamPaperQuestion }
