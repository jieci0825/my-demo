export const isString = (value: any): value is string => typeof value === 'string'
export const isNumber = (value: any): value is number => typeof value === 'number'
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'
export const isFunction = (value: any): value is Function => typeof value === 'function'
export const isObject = (value: any): value is object => typeof value === 'object' && value !== null
export const isArray = Array.isArray
export const extend = Object.assign

export type KeysOfT<T> = keyof T
// 确定一个值是一个对象，且具备指定的属性
export const isObjectWithKeys = <T>(value: any, keys: KeysOfT<T>[]): value is T => {
    if (!isObject(value)) return false
    for (const key of keys) {
        if (!(key in value)) return false
    }
    return true
}
