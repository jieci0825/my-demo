const { DataTypes, Model } = require('sequelize')
const { sequelize } = require('@/core/db')
const { md5password } = require('@/utils')

class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            set(val) {
                this.setDataValue('password', md5password(val))
            },
            allowNull: false
        }
    },
    { sequelize, tableName: 'users' }
)

module.exports = { User }
