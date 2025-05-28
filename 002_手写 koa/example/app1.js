import MyKoa from '../dist/main.js'

const app = new MyKoa()

app.use(ctx => {
	// ctx.req ctx.res 为 http 模块提供的原生对象
	// ctx.request 和 ctx.response 是 Koa 提供的封装对象
	// ctx 内部通过原型关系进行关联。ctx.__proto__.__proto__ 即可访问最原始的 ctx 对象
	// console.log(ctx.__proto__.__proto__)
	// console.log(ctx.request.path)
	// console.log(ctx.request.query)
	// console.log('映射获取', ctx.path)
	// ***** 测试多重返回响应结果 *****
	// ctx.body = '111'
	// ctx.body = '222'
	ctx.body = '333'
	// console.log('ctx.body', ctx.body)
})

const port = 3000
app.listen(port, () => {
	console.log(`服务启动成功，运行在 http://localhost:${port}`)
})
