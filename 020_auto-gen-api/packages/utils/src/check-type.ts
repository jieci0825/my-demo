export const isBoolean = (value: any): value is boolean => {
    return typeof value === 'boolean'
}

export const isNumber = (value: any): value is number => {
    return typeof value === 'number' && !isNaN(value)
}

export const isString = (value: any): value is string => {
    return typeof value === 'string'
}

export const isObject = (value: any): value is Record<string, any> => {
    return value !== null && typeof value === 'object'
}

export const isArray = <T = any>(value: any): value is T[] => {
    return Array.isArray(value)
}

export const isFunction = (value: any): value is Function => {
    return typeof value === 'function'
}

export const isUndefined = (value: any): value is undefined => {
    return typeof value === 'undefined'
}

export const isNull = (value: any): value is null => {
    return value === null
}

export const isDate = (value: any): value is Date => {
    return value instanceof Date && !isNaN(value.getTime())
}

export const isPromise = <T = any>(value: any): value is Promise<T> => {
    return (
        value !== null &&
        (typeof value === 'object' || typeof value === 'function') &&
        typeof value.then === 'function' &&
        typeof value.catch === 'function'
    )
}

export const isEmptyObject = (obj: any): boolean => {
    if (!isObject(obj)) {
        return false
    }
    return Object.keys(obj).length === 0 && obj.constructor === Object
}
