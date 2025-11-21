import { z } from 'zod'

/**
 * 获取 abc 列表验证器
 */
export const getAbcListValidator = z
    .object({
        // 因为是 demo，所以这个分页参数实际不会对返回结果产生影响，这里只是为了演示验证器用法
        page: z.coerce.number().int().min(1).describe('页码'),
        pageSize: z.coerce.number().int().min(1).max(100).describe('每页条数'),
    })
    .strict()
