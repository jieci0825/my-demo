const { User } = require('@/app/models')

class Service {
    /**
     * 根据唯一条件获取用户信息
     */
    async getUserByCondition(value, condition = 'id') {
        return await User.findOne({
            where: {
                [condition]: value
            }
        })
    }
}

module.exports = new Service()
