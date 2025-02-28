const jwt = require('jsonwebtoken')
const Koa = require('koa')
const Router = require('koa-router')
const { koaBody } = require('koa-body')
const cors = require('@koa/cors')
const NodeRSA = require('node-rsa')
const { setSymmetricKey, decryptData, generateToken } = require('./utils')

const router = new Router({ prefix: '/api' })
const app = new Koa()
app.use(cors())
app.use(koaBody())
app.use(router.routes())
app.use(router.allowedMethods())

// 存储用户数据
const usersTable = [
    {
        account: 'admin',
        password: 'admin'
    }
]

/**
 * 生成RSA密钥对
 */
const key = new NodeRSA({ b: 2048 })
key.setOptions({
    environment: 'browser',
    encryptionScheme: 'pkcs1',
    padding: 1
})

// 私钥
const privateKey = key.exportKey('private')
// 公钥 (需要提供给前端)
const publicKey = key.exportKey('public')

/**
 * 获取公钥
 */
router.get('/public-key', async ctx => {
    ctx.body = {
        errorCode: 0,
        msg: 'ok',
        data: publicKey
    }
})

/**
 * 协商对称密钥
 */
router.post('/agreement-key', async ctx => {
    const data = ctx.request.body

    const symmetricKey = key.decrypt(data.symmetricKey, 'utf8')

    setSymmetricKey(symmetricKey)

    ctx.body = {
        errorCode: 0,
        msg: 'ok',
        data: null
    }
})

/**
 * 登录
 */
router.post('/login', async ctx => {
    const data = ctx.request.body

    const account = decryptData(data.account)
    const password = decryptData(data.password)

    const current = usersTable.find(item => item.account === account)
    if (!current) {
        ctx.body = {
            errorCode: 10002,
            msg: '账号不存在',
            data: null
        }
        return
    }

    if (current.password !== password) {
        ctx.body = {
            errorCode: 10003,
            msg: '密码错误',
            data: null
        }
        return
    }

    const token = generateToken(current, privateKey, '1m')

    ctx.body = {
        errorCode: 0,
        msg: '登录成功',
        data: {
            token: 'Bearer ' + token
        }
    }
})

/**
 * 注册
 */
router.post('/register', async ctx => {
    const data = ctx.request.body

    const account = decryptData(data.account)
    const password = decryptData(data.password)

    const isExist = usersTable.some(item => item.account === account)
    if (isExist) {
        ctx.body = {
            errorCode: 10001,
            msg: '账号已存在',
            data: null
        }
        return
    }

    // todo 实际存储密码的时候，可以对密码进行加密存储 md5、bcryptjs

    usersTable.push({
        account,
        password
    })

    console.table(usersTable)

    ctx.body = {
        errorCode: 0,
        msg: '注册成功',
        data: null
    }
})

/**
 * 验证 token
 */
router.get('/verify-token', async ctx => {
    const authorization = ctx.headers.authorization
    if (!authorization) {
        ctx.body = {
            errorCode: 10002,
            msg: 'token不存在',
            data: null
        }
        return
    }

    try {
        const token = authorization.replace('Bearer ', '')
        const decode = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
        ctx.body = {
            errorCode: 0,
            msg: 'ok',
            data: decode
        }
    } catch (error) {
        ctx.status = 401
        ctx.body = {
            errorCode: 10006,
            msg: 'token无效',
            data: null
        }
    }
})

app.listen(3000, () => {
    console.log(`server is running at http://localhost:3000`)
})
