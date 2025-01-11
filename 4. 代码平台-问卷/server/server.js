const fs = require('fs')
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const cors = require('cors')

const app = express()

const PORT = 3000

// 设置允许跨域访问
app.use(cors())

// 设置静态文件目录
app.use('/uploads', express.static('uploads'))

// 使用body-parser中间件解析JSON格式的请求体，限制大小为50MB
app.use(bodyParser.json({ limit: '50mb' }))
// 使用body-parser中间件解析URL编码格式的请求体，限制大小为50MB，并使用扩展模式
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

// 设置 multer 的存储引擎
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads')
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir)
        }
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + '-' + Math.round(Math.random() * 1e9)
        cb(null, filename + path.extname(file.originalname))
    }
})

// 问题
const question = {}
// 答案
const answer = {}

// 存储问卷
app.post('/api/questionnaire', (req, res) => {
    const { id, questions } = req.body
    question[id] = questions
    res.status(200).send({
        errorCode: 0,
        message: '问卷存储成功'
    })
})

// 获取问卷
app.get('/api/questionnaire/:id', (req, res) => {
    const { id } = req.params
    if (question[id]) {
        res.status(200).send({
            errorCode: 0,
            message: '问卷获取成功',
            data: question[id]
        })
    } else {
        res.status(404).send({
            errorCode: 10001,
            message: '问卷不存在'
        })
    }
})

// 存储答案
app.post('/api/answer', (req, res) => {
    const { id, answers: curAnswers } = req.body
    answer[id] = curAnswers
    console.table(answer)
    res.status(200).send({
        errorCode: 0,
        message: '答案存储成功'
    })
})

// 设置 multer 的上传配置
const upload = multer({ storage: storage })

// 处理文件上传请求
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        res.status(200).send({
            errorCode: 0,
            message: '文件上传成功',
            url: 'http://localhost:' + PORT + '/uploads/' + req.file.filename
        })
    } catch (error) {
        res.status(500).send({
            errorCode: 10001,
            message: '文件上传失败'
        })
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
