import type { Context } from 'koa'
import * as abcService from './abc.service'

export async function getAbcList(ctx: Context) {
    console.log('abc/list query: ', ctx.query)
    const res = await abcService.getAbcList()
    ctx.success(res)
}
