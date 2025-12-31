export function isString(value) {
    return typeof value === 'string'
}

export function isNumber(value) {
    return typeof value === 'number'
}

export function isBoolean(value) {
    return typeof value === 'boolean'
}

export function isObject(value) {
    return value !== null && typeof value === 'object'
}

export const isArray = Array.isArray

export function isFunction(value) {
    return typeof value === 'function'
}

export function isUndefined(value) {
    return value === undefined
}
