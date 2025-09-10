const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('@/core/db')

class ExamSubmission extends Model {}

ExamSubmission.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // 用户ID（不使用外键关系）
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'user_id'
        },
        // 考卷ID（不使用外键关系）
        examPaperId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'exam_paper_id'
        },
        // 用户答案（JSON格式存储，key为题目ID，value为答案）
        userAnswers: {
            type: DataTypes.JSON,
            allowNull: false,
            field: 'user_answers'
        },
        // 提交时间
        submittedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
            field: 'submitted_at'
        },
        // 总分（如果需要自动计算分数）
        totalScore: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            field: 'total_score'
        }
    },
    {
        sequelize,
        tableName: 'exam_submissions'
    }
)

module.exports = { ExamSubmission }
