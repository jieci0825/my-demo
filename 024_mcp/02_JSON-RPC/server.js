import utils from './utils.js'

process.stdin.setEncoding('utf-8')

process.stdout.write('server is running... \n')

// 监听客户端发送的消息
process.stdin.on('data', data => {
    data = data.toString().trim()
    const { method, params } = JSON.parse(data)

    const result = utils[method](params)

    const response = {
        jsonrpc: '2.0',
        id: params.id,
        result
    }

    process.stdout.write('result: ' + JSON.stringify(response) + '\n')
})
