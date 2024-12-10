import { parse } from 'node:url'
import type { IncomingMessage } from 'node:http'

export interface Request {
	req: IncomingMessage
	url: IncomingMessage['url']
	header: IncomingMessage['headers']
	headers: IncomingMessage['headers']
	path: string
	query: any
}

export const request: Request = {
	req: {} as IncomingMessage,

	get header() {
		return this.req.headers
	},

	get headers() {
		return this.req.headers
	},

	get url() {
		return this.req.url
	},

	get path() {
		// 利用调用者的this指向IncomingMessage对象，获取url属性解析出 path
		const path = parse(this.req.url || '', true).pathname || ''
		return path
	},

	get query() {
		return parse(this.req.url || '', true).query
	}
}
