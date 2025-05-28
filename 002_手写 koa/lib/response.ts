import type { ServerResponse } from 'node:http'

export interface Response {
	res: ServerResponse
	status: number
	data: any
	body: any
	_body: any
}

export const response: Response = {
	res: {} as ServerResponse,
	status: 200,
	data: undefined,
	_body: undefined,
	get body() {
		return this._body
	},
	set body(newValue) {
		// 如果使用了 body 设置返回值，则 status 状态码默认为 200
		this.res.statusCode = 200
		this._body = newValue
	}
}
