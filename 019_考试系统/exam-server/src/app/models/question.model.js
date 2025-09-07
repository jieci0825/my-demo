const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('@/core/db')

class Question extends Model {}

Question.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // 题号
        sn: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // 问题
        question: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // 问题类型：选择提 简述题
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // 答案
        answer: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        // 解析
        analysis: {
            type: DataTypes.TEXT
        },
        // 属于哪个考卷
        exam_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    { sequelize, tableName: 'questions' }
)

module.exports = { Question }
