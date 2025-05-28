import Koa from 'koa'

const app = new Koa()

/**
 * 案例：
 * 下面的代码会输出顺序为：
 *  (1) 中间件1-before
 *  (2) 中间件2-before
 *  (3) 中间件1-after
 *  (4) sleep
 *  (5) 中间件3-before
 *  (6) 中间件3-after
 *  (7) 中间件2-after
 *
 * 步骤解析：
 * 1. 这是因为第二个 app.use 中间件使用了 async/await，而变成了一个异步函数
 * 2. 而注意，这里第一个 app.use 调用 next() 的时候并没有使用 await 进行等待
 * 3. 所以输出了 console.log('中间件1-before')，并执行完成 ctx.body = '111' 之后，执行这个 next()，
 * 4. 而这个 next 里面执行完成 console.log('中间件2-before') 和 ctx.body = '333' 之后，会需要等待 sleep(2000) 执行完成
 * 5. 但是由于第一个 app.use 中间件并没有使用 await，所以不会等待 sleep(2000) 执行完成，而是直接执行 next() 后面的代码
 * 6. 也就是直接执行 next 后面的代码，也就是执行 console.log('中间件1-after') 和 ctx.body = '222'，因此响应结果为 222
 * 7. 在后面的输出就遵循了传统的洋葱模型，从外到内，再从内到外
 */

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(() => {
			console.log('sleep')
			resolve()
		}, ms)
	})
}

app.use((ctx, next) => {
	console.log('中间件1-before')
	ctx.body = '111'
	next()
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

const port = 3000
app.listen(port, () => {
	console.log(`服务启动成功，运行在 http://localhost:${port}`)
})
