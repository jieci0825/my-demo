const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('@/core/db')

class ExamPaper extends Model {}

ExamPaper.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // 考卷名称
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        // 考卷分类
        category: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    { sequelize, tableName: 'exam_papers' }
)

module.exports = { ExamPaper }
