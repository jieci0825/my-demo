export function toKebabCase(input: string) {
    if (!input) return ''
    return String(input)
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[_\s]+/g, '-')
        .toLowerCase()
}

export function toCamelCase(input: string) {
    if (!input) return ''
    const kebab = toKebabCase(input)
    return kebab.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}

export function toPascalCase(input: string) {
    if (!input) return ''
    const camel = toCamelCase(input)
    return camel.charAt(0).toUpperCase() + camel.slice(1)
}
