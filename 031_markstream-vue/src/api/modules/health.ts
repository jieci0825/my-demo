import request from '../request'

import type { ApiResponse } from '../request'

export interface HealthStatus {
    status: 'ok'
    database: 'ok'
}

/**
 * 获取后端服务与数据库的健康状态。
 */
export function getHealth() {
    return request.get<ApiResponse<HealthStatus>>('/health')
}
