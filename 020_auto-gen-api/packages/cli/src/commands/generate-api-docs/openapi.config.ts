/**
 * OpenAPI 配置文件
 * 定义 API 文档的基本信息、服务器配置、安全方案等
 */

import type { SecuritySchemeConfig } from '@coderjc/types'

/**
 * API 基本信息配置
 */
export interface OpenApiInfo {
    /** API 标题 */
    title: string
    /** API 版本 */
    version: string
    /** API 描述 */
    description: string
    /** 服务条款 URL */
    termsOfService?: string
    /** 联系信息 */
    contact?: {
        name?: string
        url?: string
        email?: string
    }
    /** 许可证信息 */
    license?: {
        name: string
        url?: string
    }
}

/**
 * 服务器配置
 */
export interface OpenApiServer {
    /** 服务器 URL */
    url: string
    /** 服务器描述 */
    description: string
    /** 变量（用于 URL 模板） */
    variables?: Record<string, { default: string; description?: string; enum?: string[] }>
}

/**
 * 标签配置（用于分组）
 */
export interface OpenApiTag {
    /** 标签名称 */
    name: string
    /** 标签描述 */
    description?: string
    /** 外部文档 */
    externalDocs?: {
        description?: string
        url: string
    }
}

/**
 * 安全方案配置集合
 */
export interface SecuritySchemes {
    [key: string]: SecuritySchemeConfig
}

/**
 * 完整的 OpenAPI 配置
 */
export interface OpenApiConfig {
    /** API 基本信息 */
    info: OpenApiInfo
    /** 服务器列表 */
    servers: OpenApiServer[]
    /** 标签列表 */
    tags?: OpenApiTag[]
    /** 安全方案定义 */
    securitySchemes: SecuritySchemes
    /** 外部文档 */
    externalDocs?: {
        description?: string
        url: string
    }
}

/**
 * 默认的 OpenAPI 配置
 * 可以根据实际项目需求修改
 */
export const openApiConfig: OpenApiConfig = {
    info: {
        title: 'API 自动化生成示例',
        version: '1.0.0',
        description: `
# 某某管理系统 API 文档

这是一个基于 Koa.js 构建的管理系统后端 API。

## 功能模块

- **认证授权**: 用户登录、令牌刷新
- **用户管理**: 用户的增删改查
- **角色管理**: 角色和权限管理
- **菜单管理**: 系统菜单配置

## 认证说明

大部分 API 需要通过 JWT 认证。请先调用登录接口获取 access token，然后在后续请求的 Header 中添加：

\`\`\`
Authorization: Bearer {access_token}
\`\`\`

## 响应格式

所有接口统一返回格式：

\`\`\`json
{
  "errorCode": 200,
  "message": "操作成功",
  "success": true,
  "data": { /* 实际数据 */ }
  "timestamp": "2025-11-20T06:11:20.162Z"
}
\`\`\`

## 错误码

- 待定...
        `.trim(),
        contact: {
            name: 'coderjc',
            email: 'coderjc@qq.com',
        },
        license: {
            name: 'Apache License 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0',
        },
    },
    servers: [
        {
            url: 'http://localhost:5050',
            description: '本地开发环境',
        },
        {
            url: 'https://api.example.com',
            description: '生产环境',
        },
    ],
    tags: [
        {
            name: '认证',
            description: '用户认证相关接口，包括登录、令牌刷新等',
        },
        {
            name: '用户',
            description: '用户管理相关接口，包括用户的增删改查',
        },
        {
            name: '角色',
            description: '角色管理相关接口',
        },
        {
            name: '菜单',
            description: '菜单管理相关接口',
        },
        {
            name: '店铺',
            description: '店铺管理相关接口',
        },
    ],
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT 认证。请在 Header 中添加：Authorization: Bearer {token}',
        },
        apiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key',
            description: 'API Key 认证（可选）',
        },
    },
    externalDocs: {
        description: '查看项目文档',
        url: 'https://github.com/your-repo/xxxxx',
    },
}

/**
 * 错误响应 Schema 定义
 * 对应系统的 ApiResponse 格式
 */
export const errorResponseSchema = {
    type: 'object',
    required: ['success', 'errorCode', 'message', 'data'],
    properties: {
        success: {
            type: 'boolean',
            description: '操作是否成功（错误响应时为 false）',
            example: false,
        },
        errorCode: {
            type: 'integer',
            description: '业务错误码（详见错误码说明）',
            example: 1000,
        },
        message: {
            type: 'string',
            description: '错误信息描述',
            example: '未授权，请先登录',
        },
        data: {
            type: 'object',
            nullable: true,
            description: '附加数据（通常为 null）',
            example: null,
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
            description: '时间戳（ISO 8601 格式）',
            example: '2025-11-20T06:11:20.162Z',
        },
    },
}

/**
 * 成功响应 Schema 定义
 * 对应系统的 ApiResponse 格式
 */
export const successResponseSchema = {
    type: 'object',
    required: ['success', 'errorCode', 'message', 'data'],
    properties: {
        success: {
            type: 'boolean',
            description: '操作是否成功（成功时为 true）',
            example: true,
        },
        errorCode: {
            type: 'integer',
            description: '错误码（成功时为 0）',
            example: 0,
        },
        message: {
            type: 'string',
            description: '成功消息',
            example: '操作成功',
        },
        data: {
            type: 'object',
            description: '响应数据',
        },
        timestamp: {
            type: 'string',
            format: 'date-time',
            description: '时间戳（ISO 8601 格式）',
            example: '2025-11-20T06:11:20.162Z',
        },
    },
}

/**
 * 默认错误响应配置
 * 基于系统的异常类设计
 *
 * HTTP 状态码和业务错误码的映射关系：
 * - 400: 请求参数错误（errorCode: 3001）
 * - 401: 认证失败（errorCode: 1000-1007）
 * - 403: 权限不足（errorCode: 1005-1006）
 * - 404: 资源不存在（errorCode: 4000-4002）
 * - 409: 资源冲突（errorCode: 2004）
 * - 500: 服务器错误（errorCode: 5000-5004）
 * - 503: 服务不可用（errorCode: 5003）
 */
export const defaultErrorResponses = [
    {
        code: 400,
        description: '请求参数错误（errorCode: 3001）',
        examples: {
            'application/json': {
                success: false,
                errorCode: 3001,
                message: '参数错误',
                data: null,
                timestamp: '2025-11-20T06:11:20.162Z',
            },
        },
    },
    {
        code: 401,
        description: '未授权，需要登录或 Token 无效/过期',
        examples: {
            'application/json': {
                未登录: {
                    summary: '需要登录',
                    value: {
                        success: false,
                        errorCode: 1001,
                        message: '请先登录',
                        data: null,
                        timestamp: '2025-11-20T06:11:20.162Z',
                    },
                },
                Token无效: {
                    summary: 'Token 不合法',
                    value: {
                        success: false,
                        errorCode: 1002,
                        message: 'Token 不合法',
                        data: null,
                        timestamp: '2025-11-20T06:11:20.162Z',
                    },
                },
                Token过期: {
                    summary: 'Token 已过期',
                    value: {
                        success: false,
                        errorCode: 1003,
                        message: 'Token 已过期，请重新登录',
                        data: null,
                        timestamp: '2025-11-20T06:11:20.162Z',
                    },
                },
            },
        },
    },
    {
        code: 403,
        description: '权限不足，无法访问该资源',
        examples: {
            'application/json': {
                权限不足: {
                    summary: '权限不足',
                    value: {
                        success: false,
                        errorCode: 1005,
                        message: '权限不足',
                        data: null,
                        timestamp: '2025-11-20T06:11:20.162Z',
                    },
                },
                账户被禁用: {
                    summary: '账户已被禁用',
                    value: {
                        success: false,
                        errorCode: 1006,
                        message: '账户已被禁用',
                        data: null,
                        timestamp: '2025-11-20T06:11:20.162Z',
                    },
                },
            },
        },
    },
    {
        code: 404,
        description: '请求的资源不存在',
        examples: {
            'application/json': {
                资源不存在: {
                    summary: '资源不存在',
                    value: {
                        success: false,
                        errorCode: 4000,
                        message: '资源不存在',
                        data: null,
                        timestamp: '2025-11-20T06:11:20.162Z',
                    },
                },
                用户不存在: {
                    summary: '用户不存在',
                    value: {
                        success: false,
                        errorCode: 4002,
                        message: '用户不存在',
                        data: null,
                        timestamp: '2025-11-20T06:11:20.162Z',
                    },
                },
            },
        },
    },
    {
        code: 409,
        description: '资源冲突（如：数据已存在）',
        examples: {
            'application/json': {
                success: false,
                errorCode: 2004,
                message: '资源冲突',
                data: null,
                timestamp: '2025-11-20T06:11:20.162Z',
            },
        },
    },
    {
        code: 500,
        description: '服务器内部错误',
        examples: {
            'application/json': {
                success: false,
                errorCode: 5000,
                message: '服务器内部错误',
                data: null,
                timestamp: '2025-11-20T06:11:20.162Z',
            },
        },
    },
    {
        code: 503,
        description: '服务暂时不可用',
        examples: {
            'application/json': {
                success: false,
                errorCode: 5003,
                message: '服务暂时不可用',
                data: null,
                timestamp: '2025-11-20T06:11:20.162Z',
            },
        },
    },
]
