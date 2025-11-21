export interface ApiSchema {
    name: string
    description: string
    summary?: string
    method: string
    path: string
    fullPath: string
    auth: string
    tags?: string[]
    remarks?: string
    requestType?: string
    responseType: string
}

export interface ModuleData {
    moduleName: string
    prefix: string
    description?: string
    apis: ApiSchema[]
}

export interface Schema {
    metadata: {
        generatedAt: string
        totalModules: number
        totalApis: number
    }
    modules: Record<string, ModuleData>
}

export interface ParsePathResult {
    path: string
    params: string[]
}

export interface GenerateResult {
    module: string
    file: string
    status: 'success' | 'skipped' | 'error'
    apisCount?: number
    error?: string
}

