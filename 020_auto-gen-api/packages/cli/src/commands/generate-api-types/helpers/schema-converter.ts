import type { JsonSchema } from './types'

export function jsonSchemaToInterface(name: string, schema: JsonSchema, definitions: Record<string, JsonSchema> = {}): string {
    const lines: string[] = []

    if (schema.description) {
        lines.push(`  /** ${schema.description} */`)
    }

    lines.push(`  export interface ${name} {`)

    if (schema.type === 'object' && schema.properties) {
        const required = schema.required || []

        for (const [propName, propSchema] of Object.entries(schema.properties)) {
            let resolvedSchema: JsonSchema = propSchema
            if (propSchema.$ref) {
                const refName = propSchema.$ref.split('/').pop()
                if (refName && definitions[refName]) {
                    resolvedSchema = definitions[refName]
                }
            }

            if (propSchema.description || resolvedSchema.description) {
                lines.push(`    /** ${propSchema.description || resolvedSchema.description} */`)
            }

            const isOptional = !required.includes(propName)
            const optionalMark = isOptional ? '?' : ''

            const tsType = jsonSchemaTypeToTs(resolvedSchema, definitions)
            lines.push(`    ${propName}${optionalMark}: ${tsType};`)
        }
    } else if (schema.type === 'null') {
        return `  export type ${name} = null;`
    }

    lines.push(`  }`)

    return lines.join('\n')
}

export function jsonSchemaTypeToTs(schema: JsonSchema, definitions: Record<string, JsonSchema> = {}): string {
    if (schema.$ref) {
        const refName = schema.$ref.split('/').pop()
        return refName || 'any'
    }

    if (schema.type && Array.isArray(schema.type)) {
        return schema.type.map((t) => jsonSchemaTypeToTs({ type: t }, definitions)).join(' | ')
    }

    if (schema.anyOf) {
        return schema.anyOf.map((s) => jsonSchemaTypeToTs(s, definitions)).join(' | ')
    }

    switch (schema.type) {
        case 'string':
            return 'string'
        case 'number':
        case 'integer':
            return 'number'
        case 'boolean':
            return 'boolean'
        case 'null':
            return 'null'
        case 'array':
            if (schema.items) {
                const itemType = jsonSchemaTypeToTs(schema.items, definitions)
                return `${itemType}[]`
            }
            return 'any[]'
        case 'object':
            if (schema.properties) {
                const matchingDef = findMatchingDefinition(schema, definitions)
                if (matchingDef) {
                    return matchingDef
                }

                const props = Object.entries(schema.properties).map(([key, value]) => {
                    const type = jsonSchemaTypeToTs(value, definitions)
                    const optional = schema.required?.includes(key) ? '' : '?'
                    return `${key}${optional}: ${type}`
                })
                return `{ ${props.join('; ')} }`
            }
            return 'Record<string, any>'
        default:
            return 'any'
    }
}

export function findMatchingDefinition(schema: JsonSchema, definitions: Record<string, JsonSchema>): string | null {
    if (!schema.properties) return null

    const schemaKeys = Object.keys(schema.properties).sort().join(',')

    for (const [defName, defSchema] of Object.entries(definitions)) {
        if (defSchema.properties && schema.properties) {
            const defKeys = Object.keys(defSchema.properties).sort().join(',')
            if (schemaKeys === defKeys) {
                const allMatch = Object.keys(schema.properties).every((key) => {
                    const schemaProp = schema.properties![key]
                    const defProp = defSchema.properties![key]
                    return JSON.stringify(schemaProp) === JSON.stringify(defProp)
                })

                if (allMatch) {
                    return defName
                }
            }
        }
    }

    return null
}

export function generateDefinitions(definitions: Record<string, JsonSchema>): string {
    const lines: string[] = []

    for (const [name, schema] of Object.entries(definitions)) {
        const interfaceCode = jsonSchemaToInterface(name, schema, definitions)
        lines.push(interfaceCode)
        lines.push('')
    }

    return lines.join('\n')
}

