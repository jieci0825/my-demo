import type { IncomingMessage, ServerResponse } from 'node:http'
import { request, type Request } from './request'
import { response, type Response } from './response'

export interface Context {
	req: IncomingMessage
	res: ServerResponse
	request: Request
	response: Response
}

export const context: Context = {
	req: {} as IncomingMessage,
	res: {} as ServerResponse,
	request: {} as Request,
	response: {} as Response
}

type TargetFild = 'request' | 'response'
// 排除 context 中的属性
type Key = Exclude<keyof Request | keyof Response, keyof Context>

function defineGetter(targetFild: TargetFild, key: Key) {
	;(context as any).__defineGetter__(key, function (this: any) {
		return this[targetFild][key]
	})
}

function defineSetter(targetFild: TargetFild, key: Key) {
	;(context as any).__defineSetter__(key, function (this: any, value: any) {
		this[targetFild][key] = value
	})
}
defineSetter('response', 'body')

// 排除本身 context 就会被赋值的属性
const excludeKeys = ['req', 'res', 'request', 'response']

const requestKyes = Object.keys(request)
for (const key of requestKyes) {
	if (!excludeKeys.includes(key)) {
		defineGetter('request', key as Key)
	}
}

const responseKeys = [...Object.keys(response)]
for (const key of responseKeys) {
	if (!excludeKeys.includes(key)) {
		defineGetter('response', key as Key)
	}
}
