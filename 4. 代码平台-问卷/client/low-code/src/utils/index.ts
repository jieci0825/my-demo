import type { TextProps } from '@/types'

export function getTextEditCompStatus(props: TextProps) {
    return props.state
}

export const isString = (value: any): value is string => typeof value === 'string'
export const isNumber = (value: any): value is number => typeof value === 'number'
export const isBoolean = (value: any): value is boolean => typeof value === 'boolean'
export const isFunction = (value: any): value is Function => typeof value === 'function'
export const isObject = (value: any): value is object => typeof value === 'object' && value !== null
export const isArray = Array.isArray
