import MyKoa from '../dist/main.js'

const app = new MyKoa()

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(() => {
			console.log('sleep')
			resolve()
		}, ms)
	})
}

// await 和 return 都会等待 Promise 执行完成
// 但是 await 会等待 Promise 执行完成之后，继续执行后面的代码
// 而 return 会直接返回，后面的代码不会执行
app.use(async (ctx, next) => {
	console.log('中间件1-before')
	ctx.body = '111'
	a
	await next()
	// 测试重复调用 next() 的报错问题
	// await next()
	console.log('中间件1-after')
	ctx.body = '222'
})

app.use(async (ctx, next) => {
	console.log('中间件2-before')
	ctx.body = '333'
	await sleep(2000)
	next()
	console.log('中间件2-after')
	ctx.body = '444'
})

app.use((ctx, next) => {
	console.log('中间件3-before')
	ctx.body = '555'
	next()
	console.log('中间件3-after')
	ctx.body = '666'
})

app.on('error', err => {
	console.log('监听一个错误：', err)
})

const port = 3000
app.listen(port, () => {
	console.log(`服务启动成功，运行在 http://localhost:${port}`)
})
