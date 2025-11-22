/**
 * 这个文件就是生成 API 文档时需要用到的元数据。
 */

import type { ModuleApiMeta } from '@coderjc/types'
import { getAbcListValidator } from './abc.validator'

export const abcApiMeta: ModuleApiMeta = {
    moduleName: 'abc',
    prefix: '/api/abc',
    description: '用户管理模块，处理用户的增删改查等操作',
    apis: [
        {
            name: 'list',
            summary: '获取 abc 列表',
            description: '获取 abc 列表的描述',
            method: 'GET',
            path: '/',
            requestSchema: getAbcListValidator,
            requestType: 'GetAbcListQueryDTO',
            responseType: 'GetAbcListResponseDTO',
            auth: 'bearer',
            tags: ['列表'],
            remarks: '获取 abc 列表的备注',
            // 这个平台实际就是客户端平台的类型，比如 web、h5、miniprogram、app、admin 等。 本 demo 中就是 apps 下的子包名称。
            platforms: ['admin', 'h5'],
        },
    ],
}
