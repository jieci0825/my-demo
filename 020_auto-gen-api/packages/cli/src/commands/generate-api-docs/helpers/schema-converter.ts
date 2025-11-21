import * as TJS from 'typescript-json-schema'
import { z } from 'zod'
import { resolve } from 'path'
import { ServerDir } from '@coderjc/utils'

/**
 * 将 Zod Schema 转换为 JSON Schema
 */
export function zodSchemaToJson(schema: z.ZodType): any {
    try {
        return z.toJSONSchema(schema)
    } catch (error) {
        console.error('❌ Zod Schema 转换失败:', error instanceof Error ? error.message : error)
        return null
    }
}

/**
 * 初始化 TypeScript Schema 生成器
 */
export function initTsSchemaGenerator(moduleName: string) {
    try {
        const settings: TJS.PartialArgs = {
            required: true,
            noExtraProps: true,
            propOrder: false,
            strictNullChecks: false,
            esModuleInterop: true,
            skipLibCheck: true,
            ignoreErrors: true,
        }

        const sourceFile = `src/modules/${moduleName}/${moduleName}.dto.ts`
        const tsconfigPath = resolve(ServerDir, 'tsconfig.json')

        const program = TJS.programFromConfig(tsconfigPath, [resolve(ServerDir, sourceFile)])

        return { program, settings }
    } catch (error) {
        console.error(
            `❌ 初始化 TypeScript Schema 生成器失败 (${moduleName}):`,
            error instanceof Error ? error.message : error,
        )
        return null
    }
}

/**
 * 将 TypeScript 类型转换为 JSON Schema
 */
export function tsTypeToJsonSchema(program: TJS.Program, settings: TJS.PartialArgs, typeName: string): any {
    try {
        const schema = TJS.generateSchema(program, typeName, settings)
        return schema || null
    } catch (error) {
        console.error(`❌ TypeScript 类型转换失败 (${typeName}):`, error instanceof Error ? error.message : error)
        return null
    }
}
