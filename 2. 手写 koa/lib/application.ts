import http, { type IncomingMessage, type ServerResponse } from 'node:http'
import { context, type Context } from './context'
import { request, type Request } from './request'
import { response, type Response } from './response'

class Application {
	// 当前中间件函数
	curFn: Function | null = null
	context: Context
	request: Request
	response: Response

	constructor() {
		// 使用 Object.create 将一个对象作为原型创建一个新对象，避免直接修改导入原对象
		//  - 这一步保证每次创建 app 实例时，都是一个全新的上下文等对象
		this.context = Object.create(context)
		this.request = Object.create(request)
		this.response = Object.create(response)
	}

	use(fn: Function) {
		this.curFn = fn
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

		this.execCurFn(ctx)

		// 执行完成中间件之后，则返回响应
		res.end(ctx.body)
	}

	execCurFn(...args: any[]) {
		this.curFn && this.curFn(...args)
	}

	listen(...args: any[]) {
		// 创建http服务
		const server = http.createServer(this.handleRequest)
		server.listen(...args)
	}
}

export default Application
