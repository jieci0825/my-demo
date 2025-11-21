/**
 * API 元数据类型定义
 * 用于声明式配置 API 接口信息，便于自动生成 JSON Schema 和 API 文档
 */

import type { z } from 'zod'

/**
 * HTTP 请求方法
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * 认证类型
 */
export type AuthType = 'none' | 'bearer' | 'apiKey' | 'basic' | 'oauth2'

/**
 * 客户端平台类型
 */
export type PlatformType = 'web' | 'h5' | 'miniprogram' | 'app' | 'admin'

/**
 * 安全方案配置（用于 OpenAPI）
 */
export interface SecuritySchemeConfig {
    /** 安全方案类型 */
    type: 'http' | 'apiKey' | 'oauth2' | 'openIdConnect'
    /** HTTP 认证方案（type 为 http 时需要）*/
    scheme?: 'bearer' | 'basic'
    /** Bearer 格式（scheme 为 bearer 时可选）*/
    bearerFormat?: string
    /** API Key 位置（type 为 apiKey 时需要）*/
    in?: 'header' | 'query' | 'cookie'
    /** API Key 名称（type 为 apiKey 时需要）*/
    name?: string
    /** 描述 */
    description?: string
}

/**
 * 权限配置
 */
export interface PermissionConfig {
    /** 是否需要超级管理员权限 */
    requireSuperAdmin?: boolean
    /** 需要的角色列表（任意一个即可） */
    roles?: string[]
    /** 需要的权限列表（必须全部满足） */
    permissions?: string[]
}

/**
 * 响应状态配置
 */
export interface ResponseStatus {
    /** 状态码 */
    code: number
    /** 描述 */
    description: string
    /** 响应类型名称（TypeScript 类型） */
    type?: string
}

/**
 * 单个 API 接口元数据
 */
export interface ApiMetadata<TRequestSchema extends z.ZodType = z.ZodType, TResponseType = any> {
    /** 接口名称（用于标识，建议使用驼峰命名） */
    name: string
    /** 接口描述 */
    description: string
    /** HTTP 方法 */
    method: HttpMethod
    /** 路径（相对于模块前缀） */
    path: string
    /** 请求验证 Schema（Zod Schema） */
    requestSchema?: TRequestSchema
    /** 请求体的 TypeScript 类型名称（用于生成 JSON Schema） */
    requestType?: string
    /** 响应的 TypeScript 类型名称（用于生成 JSON Schema） */
    responseType: string
    /** 认证类型 */
    auth: AuthType
    /** 权限配置 */
    permission?: PermissionConfig
    /** 标签/分组 */
    tags?: string[]
    /** 是否已弃用 */
    deprecated?: boolean
    /** 备注信息 */
    remarks?: string
    /** 响应状态配置（默认会包含 200 成功响应） */
    responses?: ResponseStatus[]
    /** 请求摘要（简短描述，用于 OpenAPI summary） */
    summary?: string
    /** 适用的客户端平台 */
    platforms?: PlatformType[]
}

/**
 * 模块 API 元数据集合
 */
export interface ModuleApiMeta {
    /** 模块名称 */
    moduleName: string
    /** 模块路由前缀 */
    prefix: string
    /** 模块描述 */
    description?: string
    /** 该模块的所有 API 接口 */
    apis: ApiMetadata[]
}
