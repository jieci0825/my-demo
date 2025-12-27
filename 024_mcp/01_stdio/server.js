// 设置输入编码为 utf-8
process.stdin.setEncoding('utf-8')

// 向父进程(客户端)发送消息
// process.stdout.write('Hello, what is your name? \n')

process.stdin.on('data', data => {
    const res = `回复：${data}`
    process.stdout.write(res + '\n')
})
