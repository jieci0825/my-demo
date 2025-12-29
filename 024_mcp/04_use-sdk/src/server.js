import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

// 创建 mcp 服务器实例
const server = new McpServer({
    // 填充一些服务器基础信息
    name: 'demo-mcp-server',
    title: 'Demo MCP Server',
    version: '1.0.0'
})

// 注册 mcp 的工具
server.registerTool(
    'sum',
    {
        title: '求和',
        description: '相加两个数',
        inputSchema: {
            n1: z.number().describe('第一个数'),
            n2: z.number().describe('第二个数')
        }
    },
    ({ n1, n2 }) => {
        const result = n1 + n2

        // console.error('-- +++ --')

        return {
            content: [{ type: 'text', text: `${n1} + ${n2} = ${result}` }]
        }
    }
)

// 启动 mcp 服务器
async function main() {
    // 创建标准输入输出传输
    const transport = new StdioServerTransport()

    // 启动服务器
    await server.connect(transport)

    // 如果想要打印输入，不能使用 console.log，因为 console.log 会打印到标准输出，而标准输出是给客户端的
    // 所以使用 console.error
    console.error('mcp server is running...')
}

main().catch(err => {
    console.error('Fatal error in main():', err)
    process.exit(1)
})
