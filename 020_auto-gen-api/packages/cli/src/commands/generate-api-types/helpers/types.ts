export interface JsonSchema {
    type?: string | string[]
    properties?: Record<string, JsonSchema>
    required?: string[]
    items?: JsonSchema
    $ref?: string
    anyOf?: JsonSchema[]
    description?: string
    definitions?: Record<string, JsonSchema>
}

export interface ApiSchema {
    description?: string
    summary?: string
    method: string
    fullPath: string
    remarks?: string
    requestType?: string
    requestSchema?: JsonSchema
    responseType?: string
    responseSchema?: JsonSchema
}

export interface ModuleData {
    description?: string
    apis: ApiSchema[]
}

export interface SchemaData {
    modules: Record<string, ModuleData>
}

export interface GenerateResult {
    module: string
    file: string
    status: 'success' | 'error'
    error?: string
}
