import http, { type IncomingMessage, type ServerResponse } from 'node:http'
import { context, type Context } from './context'
import { request, type Request } from './request'
import { response, type Response } from './response'
import { EventEmitter } from 'events'

class Application extends EventEmitter {
	// 封装的上下文对象
	context: Context
	// 封装的请求对象
	request: Request
	// 封装的响应对象
	response: Response
	// 中间件数组
	middlewares: Function[] = []

	constructor() {
		// 引用发布订阅。将错误通过 emit 发送出去，如果外部用户需要监听错误，则可以使用 on 进行监听
		super()

		// 使用 Object.create 将一个对象作为原型创建一个新对象，避免直接修改导入原对象
		//  - 这一步保证每次创建 app 实例时，都是一个全新的上下文等对象
		this.context = Object.create(context)
		this.request = Object.create(request)
		this.response = Object.create(response)

		this.middlewares = []
	}

	use(fn: Function) {
		this.middlewares.push(fn)
	}

	createContext(req: IncomingMessage, res: ServerResponse) {
		const ctx = Object.create(this.context)
		const request = Object.create(this.request)
		const response = Object.create(this.response)

		ctx.req = req
		ctx.request = request
		ctx.request.req = req
		ctx.res = res
		ctx.response = response
		ctx.response.res = res

		return ctx
	}

	// 保证 this 指向当前实例，使用箭头函数
	handleRequest = (req: IncomingMessage, res: ServerResponse) => {
		// 这里创建的请求上下文也需要是不同的
		//  - 因此，每次请求都需要重新创建上下文
		const ctx = this.createContext(req, res)

		// * 默认设置状态码为 404
		res.statusCode = 404

		this.compose(ctx)
			.then(() => {
				let result = ctx.body
				// 如果为 undefined，则返回 Not Found
				if (result === undefined) {
					result = 'Not Found'
				}
				// 如果 ctx.body 有值则在其 set 拦截器中已经设置过状态码为 200
				// 执行完成中间件之后，则返回响应
				res.end(result)
			})
			.catch(err => {
				this.emit('error', err)
			})
	}

	// 将功能组合起来，依次执行
	compose(ctx: Context) {
		let curIdx = -1
		function dispatch(this: Application, i: number) {
			// 如果中间件数组为空，直接返回
			if (i === this.middlewares.length) return Promise.resolve()

			// 如果当前索引大于等于 i，则表示在同一个中间件中重复调用 next，抛出错误
			//  - 因为在同一个中间件中，next 只能调用一次，如果第一次调用 next 之后，会执行完所有的中间件
			//  - 而第二次调用 next 时，因为闭包闭包 i+1 得到的结果是会小于 curIdx 的，所以会抛出错误
			if (i <= curIdx) return Promise.reject(new Error('next() called multiple times'))

			curIdx = i

			const middleware = this.middlewares[i]

			// 这个函数执行本身也可能存在错误，所以需要 try/catch 包裹捕获
			try {
				// 将结果包装为 Promise
				//  - 直接取出下一个中间件函数，作为 next 函数
				return Promise.resolve(middleware(ctx, () => dispatch.call(this, i + 1)))
			} catch (error) {
				return Promise.reject(error)
			}
		}
		return dispatch.call(this, 0)
	}

	listen(...args: any[]) {
		// 创建http服务
		const server = http.createServer(this.handleRequest)
		server.listen(...args)
	}
}

export default Application
