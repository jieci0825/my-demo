import {
    AIMessage,
    HumanMessage,
    SystemMessage
} from '@langchain/core/messages'

const systemMessage = new SystemMessage('你是一个乐于助人的AI助手')

const hm1 = new HumanMessage('你好，我是小明，请帮我写一篇关于AI的文章')

// 多个内容
const hm2 = new HumanMessage({
    content: [
        { type: 'text', text: '请描述一下这张图片的内容' },
        {
            type: 'image_url',
            image: 'https://image.baidu.com/search/detail?ct=503316480&z=0&tn=baiduimagedetail&ipn=d&cl=2&cm=1&sc=0&sa=vs_ala_img_datu&lm=-1&ie=utf8&pn=2&rn=1&di=7583744013631488001&ln=0&word=%E6%A9%99%E5%AD%90%E5%9B%BE%E7%89%87&os=2951107409,633249379&cs=3043427274,2917684583&objurl=http%3A%2F%2Fpic.rmb.bdstatic.com%2Fbjh%2Fnews%2F6054d728eff9ff75b7673eec9f6098ee.png&bdtype=0&simid=3043427274,2917684583&pi=0&adpicid=0&timingneed=&spn=0&is=0,0&lid=cdb2b72701d86b2a'
        }
    ]
})

// function Calling
const hm3 = new AIMessage({
    content: '请帮我查询一下北京的天气',
    tool_calls: [
        {
            id: '123',
            function: {
                name: 'get_weather',
                arguments: '{"city": "北京"}'
            }
        }
    ]
})
console.log(hm3.toJSON())
