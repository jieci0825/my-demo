import { z } from 'zod'
import { getAbcListValidator } from './abc.validator'

// ===== 请求参数类型 =====
/**
 * 获取 abc 列表请求参数类型
 */
export type GetAbcListQueryDTO = z.infer<typeof getAbcListValidator>

// ===== 响应参数类型 =====
export type GetAbcListResponseDTO = {
    list: string[]
    total: number
}

// ===== 其他参数类型 =====
