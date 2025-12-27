import utils from './utils.js'

process.stdin.setEncoding('utf-8')

process.stdout.write('MCP server is running... \n')

// MCP 工具定义
const tools = [
    {
        name: 'sum',
        description: '计算两个数字的和',
        inputSchema: {
            type: 'object',
            properties: {
                a: {
                    type: 'number',
                    description: '第一个数字'
                },
                b: {
                    type: 'number',
                    description: '第二个数字'
                }
            },
            required: ['a', 'b']
        }
    },
    {
        name: 'createFile',
        description: '在当前目录下创建文件',
        inputSchema: {
            type: 'object',
            properties: {
                filename: {
                    type: 'string',
                    description: '文件名'
                },
                content: {
                    type: 'string',
                    description: '文件内容'
                }
            },
            required: ['filename', 'content']
        }
    }
]

// 处理请求
function handleRequest(request) {
    const { jsonrpc, id, method, params } = request

    try {
        switch (method) {
            case 'initialize':
                return {
                    jsonrpc: '2.0',
                    id,
                    result: {
                        protocolVersion: '2025-11-25',
                        capabilities: {
                            tools: {}
                        },
                        serverInfo: {
                            name: 'MCP_Server',
                            version: '1.0.0'
                        }
                    }
                }

            case 'tools/list':
                return {
                    jsonrpc: '2.0',
                    id,
                    result: {
                        tools
                    }
                }

            case 'tools/call':
                const { name, arguments: args } = params
                if (!utils[name]) {
                    throw new Error(`未知的工具: ${name}`)
                }
                const result = utils[name](args)
                return {
                    jsonrpc: '2.0',
                    id,
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: result
                            }
                        ]
                    }
                }

            default:
                throw new Error(`不支持的方法: ${method}`)
        }
    } catch (error) {
        return {
            jsonrpc: '2.0',
            id,
            error: {
                code: -32603,
                message: error.message
            }
        }
    }
}

// 监听客户端发送的消息
process.stdin.on('data', data => {
    data = data.toString().trim()
    if (!data) return

    try {
        const request = JSON.parse(data)
        const response = handleRequest(request)

        if (response) {
            process.stdout.write(JSON.stringify(response) + '\n')
        }
    } catch (error) {
        process.stderr.write(`解析请求失败: ${error.message}\n`)
    }
})
