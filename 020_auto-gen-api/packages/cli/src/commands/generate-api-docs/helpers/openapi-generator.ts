import type { OpenApiConfig } from '../openapi.config'

/**
 * 将认证类型映射为 OpenAPI 安全方案
 */
export function mapAuthToSecurity(authType: string): string | null {
    const authMap: Record<string, string> = {
        bearer: 'bearerAuth',
        jwt: 'bearerAuth',
        apiKey: 'apiKey',
        none: '',
    }
    return authMap[authType] || null
}

/**
 * 提取路径参数
 */
export function extractPathParams(path: string): any[] {
    const paramRegex = /:(\w+)/g
    const params: any[] = []
    let match

    while ((match = paramRegex.exec(path)) !== null) {
        params.push({
            name: match[1],
            in: 'path',
            required: true,
            schema: {
                type: 'string',
            },
            description: `路径参数 ${match[1]}`,
        })
    }

    return params
}

/**
 * 将路径转换为 OpenAPI 路径
 */
export function convertPathToOpenApi(path: string): string {
    return path.replace(/:(\w+)/g, '{$1}')
}

/**
 * 将 Zod Schema 转换为 OpenAPI 查询参数
 */
export function convertSchemaToQueryParams(schema: any): any[] {
    const params: any[] = []

    if (schema.properties) {
        for (const [key, value] of Object.entries(schema.properties as any)) {
            const propValue = value as any
            params.push({
                name: key,
                in: 'query',
                required: schema.required?.includes(key) || false,
                schema: {
                    type: propValue.type || 'string',
                    description: propValue.description,
                    minimum: propValue.minimum,
                    maximum: propValue.maximum,
                    pattern: propValue.pattern,
                    format: propValue.format,
                    default: propValue.default,
                },
                description: propValue.description || `查询参数 ${key}`,
            })
        }
    }

    return params
}

/**
 * 生成 OpenAPI 文档
 */
export function generateOpenApiDoc(
    modulesData: Record<string, any>,
    openApiConfig: OpenApiConfig,
    defaultErrorResponses: any[],
    errorResponseSchema: any,
    successResponseSchema: any,
): any {
    const paths: any = {}
    const schemas: any = {}

    for (const [moduleName, moduleData] of Object.entries(modulesData)) {
        for (const api of moduleData.apis) {
            const fullPath = convertPathToOpenApi(api.fullPath)

            if (!paths[fullPath]) {
                paths[fullPath] = {}
            }

            const parameters: any[] = []

            const pathParams = extractPathParams(api.path)
            parameters.push(...pathParams)

            if (api.method === 'GET' && api.requestSchema) {
                const queryParams = convertSchemaToQueryParams(api.requestSchema)
                parameters.push(...queryParams)
            }

            const requestBody: any = {}
            if (['POST', 'PUT', 'PATCH'].includes(api.method) && api.requestSchema) {
                requestBody.required = true
                requestBody.content = {
                    'application/json': {
                        schema: api.requestSchema,
                    },
                }
            }

            const responses: any = {}

            if (api.responseSchema) {
                responses['200'] = {
                    description: '成功响应',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['success', 'errorCode', 'message', 'data'],
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        description: '操作是否成功',
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
                                    data: api.responseSchema,
                                    timestamp: {
                                        type: 'string',
                                        format: 'date-time',
                                        description: '时间戳（ISO 8601 格式）',
                                        example: '2025-11-20T06:11:20.162Z',
                                    },
                                },
                            },
                        },
                    },
                }
            } else {
                responses['200'] = {
                    description: '成功响应',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' },
                        },
                    },
                }
            }

            if (api.responses) {
                for (const resp of api.responses) {
                    responses[resp.code.toString()] = {
                        description: resp.description,
                        content: {
                            'application/json': {
                                schema: resp.type ? { $ref: `#/components/schemas/${resp.type}` } : {},
                            },
                        },
                    }
                }
            }

            if (api.auth !== 'none') {
                for (const errorResp of defaultErrorResponses) {
                    if (!responses[errorResp.code.toString()]) {
                        responses[errorResp.code.toString()] = {
                            description: errorResp.description,
                            content: {
                                'application/json': {
                                    schema: { $ref: '#/components/schemas/ErrorResponse' },
                                    ...(errorResp.examples && { examples: errorResp.examples }),
                                },
                            },
                        }
                    }
                }
            }

            const security: any[] = []
            const securityScheme = mapAuthToSecurity(api.auth)
            if (securityScheme) {
                security.push({ [securityScheme]: [] })
            }

            const operation: any = {
                summary: api.summary || api.description,
                description: api.description,
                operationId: api.name,
                tags: api.tags || [moduleName],
                parameters: parameters.length > 0 ? parameters : undefined,
                requestBody: Object.keys(requestBody).length > 0 ? requestBody : undefined,
                responses,
                security: security.length > 0 ? security : undefined,
                deprecated: api.deprecated || false,
            }

            if (api.remarks) {
                operation.description += `\n\n**备注:** ${api.remarks}`
            }

            if (api.permission) {
                const permDesc: string[] = []
                if (api.permission.requireSuperAdmin) {
                    permDesc.push('需要超级管理员权限')
                }
                if (api.permission.roles && api.permission.roles.length > 0) {
                    permDesc.push(`需要角色: ${api.permission.roles.join(', ')}`)
                }
                if (api.permission.permissions && api.permission.permissions.length > 0) {
                    permDesc.push(`需要权限: ${api.permission.permissions.join(', ')}`)
                }
                if (permDesc.length > 0) {
                    operation.description += `\n\n**权限要求:** ${permDesc.join('；')}`
                }
            }

            if (api.platforms && api.platforms.length > 0) {
                operation.description += `\n\n**适用平台:** ${api.platforms.join(', ')}`
            }

            paths[fullPath][api.method.toLowerCase()] = operation
        }
    }

    const openApiDoc = {
        openapi: '3.0.3',
        info: openApiConfig.info,
        servers: openApiConfig.servers,
        tags: openApiConfig.tags,
        paths,
        components: {
            schemas: {
                ErrorResponse: errorResponseSchema,
                SuccessResponse: successResponseSchema,
            },
            securitySchemes: openApiConfig.securitySchemes,
        },
        externalDocs: openApiConfig.externalDocs,
    }

    return openApiDoc
}
