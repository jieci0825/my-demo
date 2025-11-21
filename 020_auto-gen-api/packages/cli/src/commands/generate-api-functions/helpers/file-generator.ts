export function updateIndexExports(indexFile: string, moduleNames: string[]): string {
    const lines: string[] = []

    for (const moduleName of moduleNames) {
        lines.push(`export * as ${moduleName}Api from './modules/${moduleName}'`)
    }

    lines.push('')

    return lines.join('\n')
}

