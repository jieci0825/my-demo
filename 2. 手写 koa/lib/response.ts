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
		this._body = newValue
	}
}
